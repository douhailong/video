'use client';

import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Link from 'next/link';
import { format } from 'date-fns';
import { LockOpenIcon, LockIcon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { VideoVisibility, VideoStatus } from '@/lib/enum';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import InfiniteScroll from '@/components/infinite-scroll';
import Error from '@/components/error';

import { DEFAULT_LIMIT } from '@/lib/constants';
import VideoThumbnail from '@/modules/videos/ui/components/video-thumbnail';
import SearchInput from '../components/search-input';

const VideosSection = () => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<Error />}>
        <VideoSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSectionSuspense = () => {
  const [queryText, setQueryText] = useState('');

  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT, query: queryText || undefined },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <div>
      <div className='mb-5 flex items-center justify-between px-4'>
        <SearchInput onChange={(query) => setQueryText(query)} />
        <span className='text-muted-foreground text-sm'>共 {videos.pages[0].total} 个作品</span>
      </div>
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
            {videos.pages
              .flatMap((page) => page.items)
              .map((video) => (
                <Link key={video.id} href={`/studio/videos/${video.id}`} legacyBehavior>
                  <TableRow className='cursor-pointer'>
                    <TableCell className='pl-6'>
                      <div className='flex items-center gap-2'>
                        <div className='relative aspect-video w-36 shrink-0'>
                          <VideoThumbnail
                            // thumbnailUrl={video.thumbnailUrl}
                            title={video.title}
                            duration={video.duration}
                          />
                        </div>
                        <div className='flex flex-col gap-y-1 overflow-hidden'>
                          <span className='line-clamp-1 text-sm'>{video.title}</span>
                          <span className='text-muted-foreground line-clamp-1 text-xs'>
                            {video.description || '暂无介绍'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        {video.visibility === 'private' ? (
                          <LockIcon className='size-4' />
                        ) : (
                          <LockOpenIcon className='size-4' />
                        )}
                        {VideoVisibility[video.visibility]}
                      </div>
                    </TableCell>
                    <TableCell>{VideoStatus[video.status]}</TableCell>
                    <TableCell className='truncate'>
                      {format(video.createdAt, 'yyyy-MM-dd HH:mm')}
                    </TableCell>
                    <TableCell>{video.viewCount || '-'}</TableCell>
                    <TableCell>{video.likeCount || '-'}</TableCell>
                    <TableCell>{video.commentCount || '-'}</TableCell>
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

const VideosSectionSkeleton = () => {
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

export default VideosSection;
