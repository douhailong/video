import Image from 'next/image';
import { Heart } from 'lucide-react';

import { cn, intlNumber } from '@/lib/utils';
import { formatDuration } from '@/lib/utils';

type WorkPosterProps = {
  posterUrl: string | null;
  title: string;
  duration?: number;
  likeCount?: number;
  liked?: boolean;
  className?: string;
};

const WorkPoster = ({
  posterUrl,
  title,
  duration,
  likeCount,
  liked,
  className
}: WorkPosterProps) => {
  const likeCompact = likeCount
    ? intlNumber({ notation: 'compact', number: likeCount })
    : 0;

  const hasDuration = duration !== undefined && duration !== null;
  const hasLikeCount = likeCount !== undefined && likeCount !== null;

  return (
    <div
      className={cn('relative aspect-video w-full overflow-hidden rounded-xl', className)}
    >
      <Image
        className='object-cover'
        src={posterUrl ?? '/placeholder.svg'}
        alt={title}
        fill
      />
      {hasDuration && (
        <div className='absolute bottom-2 right-2 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white'>
          {formatDuration(duration)}
        </div>
      )}
      {hasLikeCount && (
        <div className='absolute bottom-2 left-2 flex items-center gap-1 py-0.5 text-xs text-white'>
          <Heart className={cn('size-3', liked && 'fill-red-500 text-red-500')} />
          <span>{likeCompact}</span>
        </div>
      )}
    </div>
  );
};

export default WorkPoster;
