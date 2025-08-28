'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LockOpenIcon, LockIcon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { formatTime } from '@/lib/utils';
import { PostVisible, PostStatus } from '@/lib/enum';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import InfiniteScroll from '@/components/infinite-scroll';
import Boundary from '@/components/boundary';
import VideoThumbnail from '@/components/video/video-thumbnail';

import { DEFAULT_LIMIT } from '@/lib/constants';
import SearchInput from './search-input';

const PostsSection = () => {
  return (
    <Boundary fallback={<PostsSectionSkeleton />}>
      <PostSectionSuspense />
    </Boundary>
  );
};

const PostSectionSuspense = () => {
  const [queryText, setQueryText] = useState('');

  const [posts, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT, query: queryText || undefined },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <div>
      <div className='mb-5 flex items-center justify-between px-4'>
        <SearchInput onChange={(query) => setQueryText(query)} />
        <span className='text-muted-foreground text-sm'>
          共 {posts.pages[0].total} 个作品
        </span>
      </div>
      <div className='border-y'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[500px] pl-6'>视频</TableHead>
              <TableHead>权限</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>日期</TableHead>
              <TableHead>播放</TableHead>
              <TableHead>点赞</TableHead>
              <TableHead>评论</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.pages
              .flatMap((page) => page.items)
              .map((post) => (
                <Link key={post.id} href={`/studio/posts/${post.id}`} legacyBehavior>
                  <TableRow className='cursor-pointer'>
                    <TableCell className='pl-6'>
                      <div className='flex items-center gap-2'>
                        <div className='relative aspect-video w-36 shrink-0'>
                          <VideoThumbnail title={post.title} duration={post.duration} />
                        </div>
                        <div className='flex flex-col gap-y-1 text-wrap break-all'>
                          <span className='line-clamp-1 text-sm' title={post.title}>
                            {post.title}
                          </span>
                          <span
                            className='text-muted-foreground line-clamp-2 text-xs'
                            title={post.description}
                          >
                            {post.description || '暂无介绍'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        {post.visible === 'private' ? (
                          <LockIcon className='size-4' />
                        ) : (
                          <LockOpenIcon className='size-4' />
                        )}
                        {PostVisible[post.visible]}
                      </div>
                    </TableCell>
                    <TableCell>{PostStatus[post.status]}</TableCell>
                    <TableCell className='truncate'>
                      {formatTime(post.createdAt, true)}
                    </TableCell>
                    <TableCell>{post.views || '-'}</TableCell>
                    <TableCell>{post.likes || '-'}</TableCell>
                    <TableCell>{post.comments || '-'}</TableCell>
                  </TableRow>
                </Link>
              ))}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        isManual={false}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};

const PostsSectionSkeleton = () => {
  return (
    <div className='border-y'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[420px] pl-6'>视频</TableHead>
            <TableHead>权限</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>日期</TableHead>
            <TableHead>播放</TableHead>
            <TableHead>点赞</TableHead>
            <TableHead>评论</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className='pl-6'>
                <div className='flex items-center gap-4'>
                  <Skeleton className='h-20 w-36' />
                  <div className='flex flex-col gap-2'>
                    <Skeleton className='h-4 w-[100px]' />
                    <Skeleton className='h-3 w-[150px]' />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-20' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-16' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-24' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-12' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-12' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-12' />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PostsSection;
