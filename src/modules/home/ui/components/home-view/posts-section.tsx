'use client';

import { trpc } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/lib/constants';
import Boundary from '@/components/boundary';

import PostGridCard from '@/modules/posts/ui/components/post-grid-card';

type PostsSectionProps = {};

const PostsSection = (props: PostsSectionProps) => {
  return (
    <Boundary fallback={<PostsSectionSkeleton />}>
      <PostsSectionBoundary {...props} />
    </Boundary>
  );
};

const PostsSectionBoundary = ({}: PostsSectionProps) => {
  const [] = trpc.posts.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (next) => next.nextCursor }
  );

  return (
    <div className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      <PostGridCard />
      <PostGridCard />
      <PostGridCard />
      <PostGridCard />
      <PostGridCard />
      <PostGridCard />
      <PostGridCard />
      <PostGridCard />
      <PostGridCard />
      <PostGridCard />
      <PostGridCard />
      <PostGridCard />
      <PostGridCard />
    </div>
  );
};

const PostsSectionSkeleton = () => {
  return (
    <div className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      {Array.from({ length: 12 }).map((_, index) => (
        <PostGridCard.Skeleton key={index} />
      ))}
    </div>
  );
};

export default PostsSection;
