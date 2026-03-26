import Image from 'next/image';
import { Heart } from 'lucide-react';

import { cn, formatCount, formatDuration } from '@/lib/utils';
import { likeStatus } from '@/db/schema';

type ThumbnailBaseProps = {
  className?: string;
  thumbUrl: string;
  duration: number;
};

type ThumbnailProps =
  | (ThumbnailBaseProps & { size: 'sm' })
  | (ThumbnailBaseProps & {
      size?: 'defaut';
      count: number;
      status: (typeof likeStatus.enumValues)[number] | null;
    });

const Thumbnail = (props: ThumbnailProps) => {
  return (
    <div className={cn('relative aspect-video', props.className)}>
      <Image className='object-cover' src={props.thumbUrl} alt={props.thumbUrl} fill />
      {props.size !== 'sm' && (
        <div className='absolute bottom-2.5 left-2.5 flex items-center gap-1 py-0.5 text-sm text-white'>
          <Heart
            className={cn(
              'size-3.5',
              props.status === 'like' && 'fill-destructive text-destructive'
            )}
          />
          <span>{formatCount(props.count)}</span>
        </div>
      )}
      <div
        className={cn(
          'absolute bottom-2.5 right-2.5 rounded bg-black/80 px-1 py-0.5 text-sm font-medium text-white',
          props.size === 'sm' && 'bottom-1 right-1'
        )}
      >
        {formatDuration(props.duration)}
      </div>
    </div>
  );
};

export default Thumbnail;
