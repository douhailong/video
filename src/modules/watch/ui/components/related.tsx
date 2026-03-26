'use client';

import { Skeleton } from '@/components/ui/skeleton';
import Boundary from '@/components/boundary';

import PostListCard from '@/modules/posts/ui/components/post-list-card';
import PostGridCard from '@/modules/posts/ui/components/post-grid-card';
import PostCard from './post-card';

const DesktopRelated = () => {
  return (
    <Boundary fallback={<DesktopRelatedSkeleton />}>
      <DesktopRelatedSuspense />
    </Boundary>
  );
};

const DesktopRelatedSuspense = () => {
  return (
    <div>
      <div className='flex flex-col gap-2'>
        <PostCard />
        <PostCard />
        <PostCard />
      </div>
    </div>
  );
};

const DesktopRelatedSkeleton = () => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-2 pb-2'>
        <Skeleton className='h-8 w-14' />
        <Skeleton className='h-8 w-24' />
        <Skeleton className='h-8 w-16' />
      </div>
      {Array.from({ length: 8 }).map((_, index) => (
        <PostListCard.Skeleton key={index} />
      ))}
    </div>
  );
};

const MobileRelated = () => {
  return (
    <Boundary fallback={<MobileRelatedSkeleton />}>
      <MobileRelatedSuspense />
    </Boundary>
  );
};

const MobileRelatedSuspense = () => {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-y-6 md:grid-cols-3'>
      <PostCard />
      <PostCard />
      <PostCard />
    </div>
  );
};

const MobileRelatedSkeleton = () => {
  return (
    <div className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3'>
      {Array.from({ length: 10 }).map((_, index) => (
        <PostGridCard.Skeleton key={index} />
      ))}
    </div>
  );
};

export { DesktopRelated, MobileRelated };
