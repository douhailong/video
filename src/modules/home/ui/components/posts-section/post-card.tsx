'use client';

import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';

import { formatTimeDistance } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import VideoThumbnail from '@/components/video/video-thumbnail';
import VideoPlayer from '@/components/video/video-player';

import type { ManyPostTypes } from '@/modules/home/types';

type PostCardProps = {
  post: ManyPostTypes['items'][number];
};

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className='group flex cursor-pointer flex-col'>
      <Link href={`/posts/${post.id}`} className='group/inner relative flex-none'>
        <VideoThumbnail
          thumbUrl={post.thumbUrl}
          duration={post.duration}
          likes={post.likes}
          liked={post.reaction === 'like'}
          className='group-hover/inner:hidden'
        />
        <VideoPlayer
          className='hidden group-hover/inner:block'
          playbackUrl={post.playbackUrl}
          type='simple'
        />
      </Link>
      <p className='mb-0.5 mt-1.5 line-clamp-2 text-sm'>{post.title}</p>
      <div className='flex items-center justify-between'>
        <p className='text-muted-foreground w-full text-xs duration-300 hover:text-gray-800'>
          <span className=''>{post.user.name}</span>
          &nbsp;·&nbsp;
          <span>{formatTimeDistance(post.createdAt)}</span>
        </p>
        <button className='cursor-pointer opacity-0 duration-300 group-hover:opacity-100'>
          <MoreHorizontal className='text-muted-foreground size-5 hover:text-gray-800' />
        </button>
      </div>
    </div>
  );
};

PostCard.Skeleton = () => {
  return (
    <div className='group flex cursor-pointer flex-col'>
      <Skeleton className='aspect-video w-full overflow-hidden rounded-xl' />
      <Skeleton className='my-1 h-4 w-full' />
      <div className='flex gap-4'>
        <Skeleton className='h-4 w-20' />
        <Skeleton className='h-4 w-12' />
      </div>
    </div>
  );
};

export default PostCard;
