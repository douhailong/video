'use client';

import { trpc } from '@/trpc/client';
import { useIsMobile } from '@/hooks/use-mobile';
import VideoGridCard from '@/modules/videos/ui/components/video-grid-card';
import VideoRowCard from '@/modules/videos/ui/components/video-row-card';
import { DEFAULT_LIMIT } from '@/lib/constants';
import InfiniteScroll from '@/components/infinite-scroll';

type ResultsSectionProps = { query: string; categoryId?: string };

const ResultsSection = ({ categoryId, query }: ResultsSectionProps) => {
  const isMobile = useIsMobile();

  const [videos, videoQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
    {
      categoryId,
      query,
      limit: DEFAULT_LIMIT
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <>
      {isMobile ? (
        <div className='flex flex-col gap-4 gap-y-10'>
          {videos.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoGridCard key={video.id} data={video} />
            ))}
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {videos.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoRowCard key={video.id} data={video} />
            ))}
        </div>
      )}
      <InfiniteScroll
        hasNextPage={videoQuery.hasNextPage}
        fetchNextPage={videoQuery.fetchNextPage}
        isFetchingNextPage={videoQuery.isFetchingNextPage}
      />
    </>
  );
};

export default ResultsSection;
