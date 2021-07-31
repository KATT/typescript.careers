import { useDebouncedCallback } from 'hooks/useDebouncedCallback';
import { useParams } from 'hooks/useParams';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { trpc } from '../utils/trpc';
import {
  CalendarIcon,
  LocationMarkerIcon,
  UsersIcon,
  OfficeBuildingIcon,
} from '@heroicons/react/solid';

function useFilters() {
  return useParams({
    q: 'string',
    page: {
      type: 'number',
      default: 0,
    },
  });
}

function SearchInput() {
  const params = useFilters();
  const [value, setValue] = useState(params.values.q);
  const debouncedChange = useDebouncedCallback((newValue: string) => {
    params.setParams({ q: newValue, page: 0 });
  }, 300);

  useEffect(() => {
    setValue(params.values.q);
  }, [params.values.q]);

  return (
    <label>
      Search:{' '}
      <input
        type="search"
        name="q"
        placeholder="e.g. 'Senior'"
        onChange={(e) => {
          const newValue = e.target.value;
          setValue(newValue);
          debouncedChange(newValue);
        }}
        value={value}
      />
    </label>
  );
}

export default function IndexPage() {
  const { values, getParams } = useFilters();
  const input = useMemo(
    () => ({ query: values.q, cursor: values.page }),
    [values.page, values.q],
  );
  const jobsQuery = trpc.useQuery(['algolia.public.search', input], {
    keepPreviousData: true,
  });
  const utils = trpc.useContext();
  const sources = trpc.useQuery(['public.sources']);

  const hasPrevPage = values.page > 0;
  const hasNextPage = !!(
    jobsQuery.data?.nbPages && jobsQuery.data.nbPages > values.page
  );
  // prefetch next/prev page
  useEffect(() => {
    hasPrevPage &&
      utils.prefetchQuery([
        'algolia.public.search',
        { ...input, cursor: input.cursor - 1 },
      ]);
    hasNextPage &&
      utils.prefetchQuery([
        'algolia.public.search',
        { ...input, cursor: input.cursor + 1 },
      ]);
  }, [hasNextPage, hasPrevPage, input, utils]);

  // prefetch all items
  useEffect(() => {
    jobsQuery.data?.hits.forEach((hit) =>
      utils.prefetchQuery(['job.public.bySlug', hit.$slug]),
    );
  }, [jobsQuery.data?.hits, utils]);

  return (
    <>
      <Head>
        <title>TypeScript.careers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>TypeScript.careers</h1>
      <p>
        A niche job posting site - only for TypeScript jobs - currently sourcing
        from:{' '}
        {sources.data
          ?.map((source) => source.slug)
          .sort()
          .join(', ')}
        .
      </p>
      <blockquote>
        <p style={{ fontStyle: 'italic' }}>This site is a work in progress</p>
        <h4>A few cool features:</h4>
        <ul>
          <li>Zero loading times between pages / pagination</li>
          <li>Try disabling JavaScript. Page still works; even the filters.</li>
          <li>Search through Algolia</li>
          <li>
            Project is open-source on{' '}
            <a href="https://github.com/KATT/typescript.careers">GitHub</a>.
          </li>
        </ul>
      </blockquote>
      <fieldset title="Search for anything">
        <legend>Search for something here</legend>
        <form onSubmit={(e) => e.preventDefault()}>
          <SearchInput />
          <noscript>
            <input type="submit" />
          </noscript>
        </form>
      </fieldset>
      <h2>
        Jobs
        {jobsQuery.status === 'loading' && '(loading)'}
      </h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md max-w-5xl mx-auto">
        <ul className="divide-y divide-gray-200">
          {jobsQuery.data?.hits.map((item) => {
            return (
              <article key={item.id}>
                <Link href={`/job/${item.$slug}`}>
                  <a className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-indigo-600 truncate">
                          <ReactMarkdown
                            allowedElements={['em']}
                            unwrapDisallowed
                          >
                            {item.title}
                          </ReactMarkdown>
                        </h3>
                        <div className="ml-2 flex-shrink-0 flex">
                          {item.tags.length > 0 && (
                            <ul className="flex space-x-1">
                              {item.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                                >
                                  <ReactMarkdown
                                    allowedElements={['em']}
                                    unwrapDisallowed
                                  >
                                    {tag}
                                  </ReactMarkdown>
                                </span>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <UsersIcon
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            {item.title}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <OfficeBuildingIcon
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            {item.company.name}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <CalendarIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <p>
                            Published on{' '}
                            <time dateTime={item.publishDate.toJSON()}>
                              {item.publishDate.toDateString()}
                            </time>
                          </p>
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
                <h3></h3>
              </article>
            );
          })}
        </ul>
      </div>

      <hr />
      <div>
        {hasPrevPage ? (
          <Link
            href={{
              query: getParams({ page: values.page - 1 }),
            }}
          >
            <a>Previous page</a>
          </Link>
        ) : null}{' '}
        {hasNextPage ? (
          <Link
            href={{
              query: getParams({ page: values.page + 1 }),
            }}
          >
            <a>Next page</a>
          </Link>
        ) : null}
      </div>
    </>
  );
}

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.fetchQuery('posts.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
