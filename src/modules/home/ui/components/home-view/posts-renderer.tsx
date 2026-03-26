'use client';

import Link from 'next/link';

import { trpc } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/lib/constants';
import InfiniteScroll from '@/components/infinite-scroll';
import Boundary from '@/components/boundary';

import PostCard from './post-card';

const PostsRenderer = () => (
  <Boundary fallback={<PostsRendererSkeleton />}>
    <PostsRendererSuspense />
  </Boundary>
);

const PostsRendererSuspense = () => {
  const [data, query] = trpc.posts.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT * 2 },
    { getNextPageParam: (next) => next.nextCursor }
  );

  const posts = data?.pages.flatMap((page) => page.items) || [];

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8 xl:grid-cols-3 2xl:grid-cols-4'>
        {posts.map((post) => (
          <Link key={post.id} href={`/watch?v=${post.id}`}>
            <PostCard key={post.id} data={post} />
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
};

const PostsRendererSkeleton = () => (
  <div className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
    {Array.from({ length: 12 }).map((_, index) => (
      <PostCard.Skeleton key={index} />
    ))}
  </div>
);

export default PostsRenderer;
