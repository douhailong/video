'use client';

import { trpc } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/lib/constants';
import InfiniteScroll from '@/components/infinite-scroll';
import Boundary from '@/components/boundary';

import PlaylistCard from './playlist-card';

type PlaylistRendererProps = { visible?: 'public' | 'private' };

const PlaylistRenderer = ({ visible }: PlaylistRendererProps) => (
  <Boundary fallback={<PlaylistRendererSkeleton />}>
    <PlaylistRendererSuspense visible={visible} />
  </Boundary>
);

const PlaylistRendererSuspense = ({ visible }: PlaylistRendererProps) => {
  const [data, query] = trpc.playlists.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT, visible },
    { getNextPageParam: (next) => next.nextCursor }
  );

  const playlists = data?.pages.flatMap((page) => page.items) || [];

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-3 xl:grid-cols-4'>
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} data={playlist} />
        ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </>
  );
};

const PlaylistRendererSkeleton = () => (
  <div className='grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-3 xl:grid-cols-4'>
    {Array.from({ length: 8 }).map((_, index) => (
      <PlaylistCard.Skeleton key={index} />
    ))}
  </div>
);

export default PlaylistRenderer;
