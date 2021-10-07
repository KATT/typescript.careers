/**
 * This file contains the root router of your tRPC-backend
 */
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '../trpc';
import TurndownService from 'turndown';

const turndownService = new TurndownService();

export const jobRouter = createRouter()
  //
  .query('public.bySlug', {
    input: z.string(),
    async resolve({ ctx, input }) {
      const parts = input.split('-');
      const [sourceSlug, sourceKey] = parts;
      const job = await ctx.prisma.job.findFirst({
        where: {
          OR: [
            {
              shortId: parts[0],
            },
            {
              sourceKey,
              sourceSlug,
            },
          ],
        },
        include: {
          company: true,
          source: true,
        },
      });
      if (!job) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      const isHtmlTest = /<\/?[a-z][\s\S]*>/i;
      const $wasHtml = isHtmlTest.test(job.text);
      const $mrkdwn = $wasHtml ? turndownService.turndown(job.text) : job.text;
      return {
        ...job,
        $mrkdwn,
        $wasHtml,
      };
    },
  });
