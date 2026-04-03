'use client';

import { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { trpc } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/lib/constants';
import InfiniteScroll from '@/components/infinite-scroll';
import { RowCard, ColumnCard } from '@/components/card';

const tabs = [
  { name: 'TA的作品', key: '1' },
  { name: '作品合集', key: '2' },
  { name: '收藏', key: '3' }
];

type TabKey = (typeof tabs)[number]['key'];

const DesktopRelated = () => {
  const [currentTab, setCurrentTab] = useState<TabKey>('1');

  const [data, query] = trpc.watch.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (next) => next.nextCursor }
  );

  const posts = data?.pages.flatMap((page) => page.items) || [];

  return (
    <Tabs value={currentTab} onValueChange={(val) => setCurrentTab(val as TabKey)}>
      <TabsList variant='button'>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.key} value={tab.key}>
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className='flex flex-col gap-2'>
        {posts.map((post) => (
          <RowCard
            key={post.id}
            user={post.user}
            data={{
              title: post.title,
              thumbUrl: post.thumbUrl,
              playbackUrl: 'string',
              duration: 1002,
              viewCount: post.viewCount,
              createdAt: post.createdAt
            }}
          />
        ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </Tabs>
  );
};

const DesktopLoading = () => (
  <div>
    <div className='mb-3 flex gap-2'>
      <Skeleton className='w-19 h-8 rounded-md' />
      <Skeleton className='h-8 w-16 rounded-md' />
      <Skeleton className='w-13 h-8 rounded-md' />
    </div>
    <div className='flex flex-col gap-2'>
      {Array.from({ length: 8 }).map((_, index) => (
        <RowCard.Loading key={index} />
      ))}
    </div>
  </div>
);

const MobileRelated = () => {
  const [currentTab, setCurrentTab] = useState<TabKey>('1');

  const [data, query] = trpc.posts.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (next) => next.nextCursor }
  );

  const posts = data?.pages.flatMap((page) => page.items) || [];

  return (
    <Tabs value={currentTab} onValueChange={(val) => setCurrentTab(val as TabKey)}>
      <TabsList variant='button' className='px-4 sm:px-0'>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.key} value={tab.key}>
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className='grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8'>
        {posts.map((post) => (
          <ColumnCard
            key={post.id}
            user={post.user}
            data={{
              title: post.title,
              thumbUrl: post.thumbUrl,
              playbackUrl: 'string',
              duration: 1002,
              viewCount: post.viewCount,
              createdAt: post.createdAt
            }}
          />
        ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </Tabs>
  );
};

const MobileLoading = () => {
  return (
    <div>
      <div className='mb-3 flex gap-2 px-4 sm:px-0'>
        <Skeleton className='w-19 h-8 rounded-md' />
        <Skeleton className='h-8 w-16 rounded-md' />
        <Skeleton className='w-13 h-8 rounded-md' />
      </div>
      <div className='grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8'>
        {Array.from({ length: 8 }).map((_, index) => (
          <ColumnCard.Loading key={index} />
        ))}
      </div>
    </div>
  );
};

export { DesktopRelated, MobileRelated, DesktopLoading, MobileLoading };
