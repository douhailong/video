import { useMemo } from 'react';
import Link from 'next/link';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import UserInfo from '@/modules/users/ui/components/user-info';
import UserAvatar from '@/components/user-avatar';

import VideoMenu from './video-menu';
import VideoThumbnail from './video-thumbnail';
import { MixManyVideoTypes } from '../../types';

const cardVariants = cva('group flex min-w-0', {
  variants: {
    size: {
      default: 'gap-4',
      compact: 'gap-2'
    }
  },
  defaultVariants: {
    size: 'default'
  }
});

const thumbnailVariants = cva('relative flex-none', {
  variants: {
    size: {
      default: 'w-[38%]',
      compact: 'w-[168px]'
    }
  },
  defaultVariants: {
    size: 'default'
  }
});

type VideoRowCardProps = {
  data: MixManyVideoTypes['items'][number];
  onRemove?: () => void;
} & VariantProps<typeof cardVariants>;

const VideoRowCard = ({ data, onRemove, size = 'default' }: VideoRowCardProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat('en', { notation: 'compact' }).format(data.viewCount);
  }, [data.viewCount]);

  const compactLikes = useMemo(() => {
    return Intl.NumberFormat('en', { notation: 'compact' }).format(data.likeCount);
  }, [data.likeCount]);

  return (
    <div className={cardVariants({ size })}>
      <Link href={`/videos/${data.id}`} className={thumbnailVariants({ size })}>
        <VideoThumbnail
          thumbnailUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
          title={data.title}
          duration={data.duration}
        />
      </Link>
      <div className='flex-1'>
        <div className='flex justify-between gap-x-2'>
          <Link href={`/videos/${data.id}`} className='felx-1'>
            <h3
              className={cn(
                'font-medium line-clamp-2',
                size === 'compact' ? 'text-sm' : 'text-base'
              )}
            >
              {data.title}
            </h3>
            {size === 'default' && (
              <p className='text-xs text-muted-foreground mt-1'>
                {compactViews} views ● {compactLikes} likes
              </p>
            )}
            {size === 'default' && (
              <>
                <div className='flex items-center gap-2 my-3'>
                  <UserAvatar size='sm' imageUrl={data.user.imageUrl} name={data.user.name} />
                  <UserInfo size='sm' name={data.user.name} />
                </div>
                <p className='text-xs text-muted-foreground w-fit line-clamp-2'>
                  {data.description || 'No description'}
                </p>
              </>
            )}

            {size === 'compact' && <UserInfo size='sm' name={data.user.name} />}
            {size === 'compact' && (
              <p className='text-xs text-muted-foreground w-fit line-clamp-2'>
                {compactViews} views ● {compactLikes} likes
              </p>
            )}
          </Link>
          <div className='flex-noen'>
            <VideoMenu videoId={data.id} onRemove={onRemove} variant='ghost' />
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoRowCardSkeleton = () => {
  return <div>1</div>;
};

VideoRowCard.Skeleton = VideoRowCardSkeleton;

export default VideoRowCard;
