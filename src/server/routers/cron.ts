import aws from 'aws-sdk';
import { createRouter } from 'server/trpc';
import { alogliaReindex } from 'server/utils/algolia';
import { bulkUpsertJobs } from 'server/crawlers/bulkUpsert';
import { SOURCES } from 'server/crawlers/sources';
import { z } from 'zod';
import { env } from 'server/env';
import { lqipFromBlob } from 'server/utils/lqip';

const s3 = new aws.S3();

aws.config.update({
  accessKeyId: env.S3_ACCESS_KEY_ID,
  secretAccessKey: env.S3_ACCESS_KEY_SECRET,
  region: env.S3_REGION,
  signatureVersion: 'v4',
});
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
        const logoUrl = company.logoUrl;
        if (!logoUrl) continue;
        const imageExists = await ctx.prisma.image.findUnique({
          where: {
            originalUrl: logoUrl,
          },
        });
        if (!imageExists) {
          console.log('Downloading image', logoUrl);
          const res = await fetch(logoUrl);
          const blob = await res.blob();
          if (blob && res.ok) {
            const { lqip, width, height } = await lqipFromBlob(blob);
            const key = logoUrl.replace(/^https?\:\/\//, '').toLowerCase();
            const url = await new Promise<string>((resolve, reject) => {
              s3.upload(
                {
                  Key: key,
                  Bucket: env.S3_BUCKET_NAME,
                  Body: blob,
                  ACL: 'public-read',
                },
                (err, data) => {
                  if (err) {
                    console.error('S3 error', err);
                    reject(err);
                  } else {
                    resolve(data.Location);
                  }
                },
              );
            });
            console.log({ url, width, height, lqip });
          }
        }

        // await ctx.prisma.company.update({
        //   where: {
        //     id: company.id,
        //   },
        //   data: {
        //     logoUrl: null,
        //   },
        // });
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
    async resolve({ ctx }) {
      const res = await fetch(ctx.APP_URL);
      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }
      return res.status;
    },
  });
