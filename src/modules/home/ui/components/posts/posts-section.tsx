'use client';

import { trpc } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/lib/constants';
import InfiniteScroll from '@/components/infinite-scroll';
import Boundary from '@/components/boundary';

import PostCard from './post-card';

const PostsSection = () => {
  return (
    <Boundary fallback={<PostsSectionSkeleton />}>
      <PostsSectionSuspense />
    </Boundary>
  );
};

const PostsSectionSuspense = () => {
  const [posts, query] = trpc.posts.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <>
      <div className='grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2 xl:grid-cols-3'>
        {posts.pages
          .flatMap((page) => page.items)
          .map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        fetchNextPage={query.fetchNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </>
  );
};

const PostsSectionSkeleton = () => {
  return (
    <div className='grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2 xl:grid-cols-3'>
      {Array.from({ length: 10 }).map((_, index) => (
        <PostCard.Skeleton key={index} />
      ))}
    </div>
  );
};

export default PostsSection;
