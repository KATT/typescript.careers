import clsx from 'clsx';
import { useIsDev } from 'hooks/useIsDev';
import { useMutation, useQuery } from 'utils/trpc';
import { A } from './A';

export function Footer() {
  const sources = useQuery(['public.sources']);
  const reindex = useMutation('cron.reindex');
  const pull = useMutation('cron.pull');
  const isDev = useIsDev();
  return (
    <footer className="bg-gray-800" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
                  Links
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <A
                      href="https://twitter.com/alexdotjs"
                      className="text-base text-gray-300 hover:text-white"
                      target="_blank"
                    >
                      @alexdotjs on Twitter
                    </A>
                  </li>
                </ul>
                {/* <ul className="mt-4 space-y-4">
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-base text-gray-300 hover:text-white">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul> 
                */}
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
                  Company
                </h3>
                {/* <ul className="mt-4 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-base text-gray-300 hover:text-white">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul> */}
              </div>
              {isDev && (
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
                    ⚙️ Dev
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {sources.data?.map((source) => (
                      <li key={source.id}>
                        <button
                          onClick={() => pull.mutate(source.slug)}
                          disabled={pull.isLoading}
                          className={clsx(
                            'text-base text-gray-300 hover:text-white',
                            pull.isLoading &&
                              'animate-pulse cursor-not-allowed',
                          )}
                        >
                          {source.slug}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={() => reindex.mutate(null)}
                        disabled={reindex.isLoading}
                        className={clsx(
                          'text-base text-gray-300 hover:text-white',
                          reindex.isLoading &&
                            'animate-pulse cursor-not-allowed',
                        )}
                      >
                        reindex
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 xl:mt-0">
            {/* <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
              Subscribe to new jobs
            </h3>
            <p className="mt-4 text-base text-gray-300">
              The latest TypeScript-related jobs, sent to your inbox weekly.
            </p>
            <form className="mt-4 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="w-full min-w-0 px-4 py-2 text-base text-gray-900 placeholder-gray-500 bg-white border border-transparent rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white focus:border-white focus:placeholder-gray-400"
                placeholder="Enter your email"
              />
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary-500"
                >
                  Subscribe
                </button>
              </div>
            </form> */}
          </div>
        </div>
        <div className="pt-8 mt-8 border-t border-gray-700 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            {/* {navigation.social.map((item) => (
              <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">{item.name}</span>
                <item.icon className="w-6 h-6" aria-hidden="true" />
              </a>
            ))} */}
          </div>
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} KATTCORP AB. All rights reserved.
            <br />
            This site was started as a reference project for{' '}
            <A
              href="https://trpc.io"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-gray-200"
            >
              tRPC
            </A>{' '}
            and the{' '}
            <A
              href="https://github.com/KATT/typescript.careers"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-gray-200"
            >
              source is on Github
            </A>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
