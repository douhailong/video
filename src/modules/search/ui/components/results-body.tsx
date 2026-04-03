'use client';

import Link from 'next/link';

import { trpc } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/lib/constants';
import InfiniteScroll from '@/components/infinite-scroll';
import { ColumnCard } from '@/components/card';

type ResultsBodyProps = { query: string; categoryId?: string };

const ResultsBody = ({ categoryId, query }: ResultsBodyProps) => {
  const [data, queryFn] = trpc.search.getMany.useSuspenseInfiniteQuery(
    {
      categoryId,
      query,
      limit: DEFAULT_LIMIT
    },
    { getNextPageParam: (next) => next.nextCursor }
  );

  const posts = data?.pages.flatMap((page) => page.items) || [];

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8 xl:grid-cols-3 2xl:grid-cols-4'>
        {posts.map((post) => (
          <Link key={post.id} href={`/watch?v=${post.id}`}>
            <ColumnCard
              user={post.user}
              data={{
                title: post.title,
                thumbUrl: post.thumbUrl,
                duration: 1008,
                viewCount: post.viewCount,
                createdAt: post.createdAt,
                playbackUrl: ''
              }}
            />
          </Link>
        ))}
      </div>
      <InfiniteScroll
        hasNextPage={queryFn.hasNextPage}
        fetchNextPage={queryFn.fetchNextPage}
        isFetchingNextPage={queryFn.isFetchingNextPage}
      />
    </>
  );
};

const Loading = () => (
  <div className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
    {Array.from({ length: 12 }).map((_, index) => (
      <ColumnCard.Loading key={index} />
    ))}
  </div>
);

export { ResultsBody, Loading };
