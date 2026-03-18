'use client';

import Link from 'next/link';

import { trpc } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/lib/constants';
import Boundary from '@/components/boundary';

import PostGridCard from '@/modules/posts/ui/components/post-grid-card';

const PostsSection = () => (
  <Boundary fallback={<PostsSectionSkeleton />}>
    <PostsSectionSuspense />
  </Boundary>
);

const PostsSectionSuspense = () => {
  const [data] = trpc.posts.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (next) => next.nextCursor }
  );

  const posts = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className='grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8 xl:grid-cols-3 2xl:grid-cols-4'>
      {posts.map((post) => (
        <Link key={post.id} href={`/watch?v=${post.id}`}>
          <PostGridCard title={post.title} createdAt={post.createdAt} user={post.user} />
        </Link>
      ))}
    </div>
  );
};

const PostsSectionSkeleton = () => (
  <div className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
    {Array.from({ length: 12 }).map((_, index) => (
      <PostGridCard.Skeleton key={index} />
    ))}
  </div>
);

export default PostsSection;
