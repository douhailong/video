'use client';

import Link from 'next/link';

import { trpc } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/lib/constants';
import InfiniteScroll from '@/components/infinite-scroll';
import { ColumnCard } from '@/components/card';

export function HomeBody() {
  const [data, query] = trpc.posts.home.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT * 2 },
    { getNextPageParam: (next) => next.nextCursor }
  );

  const posts = data?.pages.flatMap((page) => page.items) || [];

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8 xl:grid-cols-3 2xl:grid-cols-4'>
        {posts.map((post) => (
          <Link key={post.id} href={`/watch?v=${post.id}`}>
            <ColumnCard
              onFocusColor={{ lightTheme: '', darkTheme: '' }}
              key={post.id}
              user={post.user}
              data={{
                thumbUrl: post.thumbUrl,
                viewCount: post.viewCount,
                title: post.title,
                duration: 10090000,
                createdAt: post.createdAt,
                playbackUrl: ''
              }}
            />
          </Link>
        ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </>
  );
}

export function Loading() {
  return (
    <div className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      {Array.from({ length: 12 }).map((_, index) => (
        <ColumnCard.Loading key={index} />
      ))}
    </div>
  );
}
