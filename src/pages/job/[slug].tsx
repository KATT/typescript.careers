import {
  CalendarIcon,
  LocationMarkerIcon,
  OfficeBuildingIcon,
} from '@heroicons/react/solid';
import { Footer } from 'components/Footer';
import { Main } from 'components/Main';
import { useIsDev } from 'hooks/useIsDev';
import { JobPostingJsonLd } from 'next-seo';
import { useRouter } from 'next/dist/client/router';
import ReactMarkdown from 'react-markdown';
import { useQuery } from 'utils/trpc';

import NextError from 'next/error';
export default function JobPage() {
  const slug = useRouter().query.slug as string;

  const query = useQuery(['job.public.bySlug', slug]);

  const item = query.data;
  const isDev = useIsDev();

  if (query.error) {
    const statusCode = query.error.data?.httpStatus ?? 500;
    return <NextError title={query.error.message} statusCode={statusCode} />;
  }
  return (
    <>
      <Main>
        {item && (
          <div className="max-w-4xl mx-auto my-5 overflow-hidden bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                {item.title}
              </h1>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    <LocationMarkerIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <ReactMarkdown allowedElements={['em']} unwrapDisallowed>
                      {item.location ?? 'Unknown'}
                    </ReactMarkdown>
                  </p>
                  <p className="flex items-center mt-2 text-sm text-gray-500 sm:mt-0 sm:ml-6">
                    <OfficeBuildingIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    {item.company.name}
                  </p>
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-500 sm:mt-0">
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

              <div className="my-2">
                <ReactMarkdown className="prose lg:prose-lg xl:prose-xl">
                  {item.$mrkdwn}
                </ReactMarkdown>
              </div>

              <a
                href={item.applyUrl}
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Apply Now on {item.source.slug}
              </a>
            </div>
            {isDev && (
              <>
                <h2>Raw data</h2>
                <details>
                  <pre>{JSON.stringify(item, null, 4)}</pre>
                </details>
                <JobPostingJsonLd
                  datePosted={item.publishDate.toDateString()}
                  description={item.text}
                  hiringOrganization={{
                    name: item.company.name,
                    sameAs: item.company.name,
                  }}
                  title={item.title}
                  validThrough={item.publishDate
                    .setDate(item.publishDate.getDate() + 90)
                    .toString()}
                />
              </>
            )}
          </div>
        )}
      </Main>
      <Footer />
    </>
  );
}
