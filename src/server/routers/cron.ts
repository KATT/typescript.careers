import { bulkUpsertJobs } from 'server/crawlers/bulkUpsert';
import { SOURCES } from 'server/crawlers/sources';
import { createRouter } from 'server/trpc';
import { alogliaReindex } from 'server/utils/algolia';
import { lqipFromBlob } from 'server/utils/lqip';
import { z } from 'zod';
import fetch from 'node-fetch';
import { Prisma } from '@prisma/client';

export const cronRouter = createRouter()
  // TODO make private / auth
  .mutation('reindex', {
    async resolve() {
      return await alogliaReindex();
    },
  })
  .mutation('images', {
    async resolve({ ctx }) {
      const companiesWithNewLogos = await ctx.prisma.company.findMany({
        where: {
          logoUrl: {
            not: null,
          },
        },
      });

      console.log({ companiesWithNewLogos });
      for (const company of companiesWithNewLogos) {
        console.log('Checking if ', company.logoUrl, 'needs downloading');
        try {
          const logoUrl = company.logoUrl;
          if (!logoUrl) continue;
          const imageExists = await ctx.prisma.image.findUnique({
            where: {
              originalUrl: logoUrl,
            },
          });
          if (imageExists) {
            continue;
          }
          console.log('--Downloading image', logoUrl);
          const res = await fetch(logoUrl);
          const blob = await res.blob();

          if (!blob || !res.ok) {
            continue;
          }
          console.log({ logoUrl });
          const { lqip, width, height } = await lqipFromBlob(blob);
          console.log({ width, height, logoUrl });
          const imageData: Prisma.ImageCreateInput = {
            blob: await res.buffer(),
            originalUrl: logoUrl,
            lqip,
            width,
            height,
            mimetype: blob.type,
          };
          const image = await ctx.prisma.image.upsert({
            where: {
              originalUrl: logoUrl,
            },
            create: imageData,
            update: imageData,
          });
          await ctx.prisma.company.update({
            where: {
              id: company.id,
            },
            data: {
              logoUrl: null,
              logoId: image.id,
            },
          });
        } catch (err) {
          console.log('Failed', (err as any).message, (err as any).stack);
        }
      }
      return null;
    },
  })
  .mutation('pull', {
    input: z.string(),
    async resolve({ ctx, input }) {
      const source = await ctx.prisma.source.findUnique({
        where: { slug: input },
      });
      if (!source || !SOURCES[source.slug]) {
        throw new Error(`No such source "${input}"`);
      }
      console.log('🏃‍♂️', source.slug);
      const fn = SOURCES[source.slug];
      if (!fn) {
        throw new Error(`No such source "${source.slug}"`);
      }
      console.time(`${source.slug} crawling`);
      const items = await fn(source);
      console.timeEnd(`${source.slug} crawling`);

      console.time(`${source.slug} upsert ${items.length} items`);
      await bulkUpsertJobs({ source, items });
      console.timeEnd(`${source.slug} upsert ${items.length} items`);
      console.time('reindexing');
      const algolia = await alogliaReindex();
      console.timeEnd('reindexing');

      return { algolia, items: items.length };
    },
  })
  .query('keep-fresh', {
    // endpoint for periodically fetching home page and keeping it edge-cached
    async resolve() {
      const res = await fetch(`https://typescript.careers`);
      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }
      return res.status;
    },
  });
