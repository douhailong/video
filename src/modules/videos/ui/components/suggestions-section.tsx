'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { trpc } from '@/trpc/client';

import VideoRowCard from './video-row-card';
import VideoGridCard from './video-grid-card';
import { DEFAULT_LIMIT } from '@/lib/constants';
import InfiniteScroll from '@/components/infinite-scroll';

type SuggestionsSectionProps = {
  videoId: string;
  isManual?: boolean;
};

const SuggestionsSectionSuspense = ({ videoId, isManual }: SuggestionsSectionProps) => {
  return (
    <Suspense fallback={<p>...Loading</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <SuggestionsSection videoId={videoId} isManual={isManual} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default SuggestionsSectionSuspense;

const SuggestionsSection = ({ videoId, isManual }: SuggestionsSectionProps) => {
  const [suggestions, query] = trpc.suggestions.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <>
      <div className='hidden sm:block space-y-3'>
        {suggestions.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard key={video.id} size='compact' data={video} />
          ))}
      </div>
      <div className='block sm:hidden space-y-10'>
        {suggestions.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))}
      </div>
      <InfiniteScroll
        isManual={isManual}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </>
  );
};

const SuggestionsSectionSkeleton = () => {
  return <div></div>;
};
