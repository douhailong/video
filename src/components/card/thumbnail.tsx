import Image from 'next/image';
import { cn, formatDuration } from '@/lib/utils';

type ThumbnailProps = {
  className?: string;
  thumbUrl?: string | null;
  duration: number;
  // viewCount: number;
  // size: 'sm' | 'default';
};

const Thumbnail = (props: ThumbnailProps) => {
  return (
    <div className={cn('relative aspect-video', props.className)}>
      <Image
        className='object-cover'
        src={props.thumbUrl ?? '/placeholder.svg'}
        alt={props.thumbUrl ?? 'placeholder'}
        fill
      />
      <div
        className={cn(
          'absolute bottom-2.5 right-2.5 rounded bg-black/80 px-1 py-0.5 text-sm font-medium text-white'
          // props.size === 'sm' && 'bottom-1 right-1'
        )}
      >
        {formatDuration(props.duration)}
      </div>
    </div>
  );
};

export { Thumbnail };
