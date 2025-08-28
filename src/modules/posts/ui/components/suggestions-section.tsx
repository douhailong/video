'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { trpc } from '@/trpc/client';
import InfiniteScroll from '@/components/infinite-scroll';
import Error from '@/components/error';

import { DEFAULT_LIMIT } from '@/lib/constants';
import VideoRowCard from './video-row-card';
import VideoGridCard from './video-grid-card';

type SuggestionsSectionProps = {
  videoId: string;
  isManual?: boolean;
};

const SuggestionsSection = ({ videoId, isManual }: SuggestionsSectionProps) => {
  return (
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<SuggestionsSectionSkeleton />}>
        <SuggestionsSectionSuspense videoId={videoId} isManual={isManual} />
      </Suspense>
    </ErrorBoundary>
  );
};

const SuggestionsSectionSuspense = ({ videoId, isManual }: SuggestionsSectionProps) => {
  const [suggestions, query] = trpc.suggestions.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <>
      <div className='hidden space-y-3 sm:block'>
        {suggestions.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard key={video.id} size='compact' data={video} />
          ))}
      </div>
      <div className='block space-y-10 sm:hidden'>
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
  return <div>Loading...</div>;
};

export default SuggestionsSection;
