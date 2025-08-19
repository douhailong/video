import { useMemo } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

import VideoThumbnail from './video-thumbnail';
import { Heart, MoreHorizontal } from 'lucide-react';

type VideoCardProps = {
  id: string;
  title: string;
  username: string;
  createAt: string;
  duration: number;
  viewCount: number;
  likeCount: number;
  playbackUrl: string;
  thumbnailUrl: string;
};

const VideoCard = ({
  id,
  title,
  username,
  createAt,
  duration,
  viewCount,
  likeCount,
  playbackUrl,
  thumbnailUrl
}: VideoCardProps) => {
  const views = Intl.NumberFormat('cn', { notation: 'compact' }).format(viewCount);
  const likes = Intl.NumberFormat('cn', { notation: 'compact' }).format(likeCount);

  return (
    <div className='group flex cursor-pointer flex-col'>
      <Link href={`/videos/${id}`} className='relative flex-none'>
        <VideoThumbnail
          // thumbnailUrl={data.thumbnailUrl}
          title={title}
          duration={100}
        />
        <div className='absolute bottom-2 left-2 flex items-center gap-1 text-xs text-white'>
          <Heart className={cn('size-3.5', true && 'fill-red-500 text-red-500')} />
          <span>{views}</span>
        </div>
      </Link>
      <p className='mb-0.5 mt-1.5 line-clamp-2 text-sm'>{title}</p>
      <div className='flex items-center justify-between'>
        <p className='text-muted-foreground w-full text-xs duration-300 hover:text-gray-800'>
          <span className=''>{username}</span>
          &nbsp;·&nbsp;
          <span>{likes}</span>
        </p>
        <button className='cursor-pointer opacity-0 duration-300 group-hover:opacity-100'>
          <MoreHorizontal className='text-muted-foreground size-5 hover:text-gray-800' />
        </button>
      </div>
    </div>
  );
};

const VideoCardSkeleton = () => {
  return (
    <div>
      <Skeleton />
    </div>
  );
};

VideoCard.Skeleton = VideoCardSkeleton;

export default VideoCard;
