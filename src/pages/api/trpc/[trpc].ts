/**
 * This file contains tRPC's HTTP response handler
 */
import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from 'server/routers/app';
import { createContext } from 'server/trpc';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  /**
   * @link https://trpc.io/docs/context
   */
  createContext,
  /**
   * @link https://trpc.io/docs/error-handling
   */
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('❌ ❌ ❌ Something went wrong', error);
    }
  },
  responseMeta({ paths, ctx }) {
    // assuming you have a router prefixed with `public.` where you colocate publicly accessible routes
    const isPublic = paths && !paths.every((path) => path.includes('public'));

    // check if it's a query & public
    if (ctx?.req.method === 'GET' && isPublic) {
      console.log('🏎 Caching:', ctx.req.url);
      // cache request for 1 day + revalidate once every second
      const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
      return {
        headers: {
          'Cache-Control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
        },
      };
    }
    return {};
  },
});
