import Image from 'next/image';
import { Heart } from 'lucide-react';

import { cn, formatDuration, intlNumber } from '@/lib/utils';

type PostThumbnailProps = {
  className?: string;
  imageUrl: string;
  likeCount: number;
  duration: number;
  alt: string;
};

const PostThumbnail = ({ className, imageUrl, alt }: PostThumbnailProps) => {
  const likeCount = 100;
  const duration = 1000;

  const likeCompact = likeCount
    ? intlNumber({ notation: 'compact', number: likeCount })
    : 0;

  const hasDuration = duration !== undefined && duration !== null;
  const hasLikeCount = likeCount !== undefined && likeCount !== null;

  return (
    <div
      className={cn('relative aspect-video w-full overflow-hidden rounded-lg', className)}
    >
      <Image className='object-cover' src={imageUrl} alt={alt} fill />
      {hasLikeCount && (
        <div className='absolute bottom-3 left-3 flex items-center gap-1.5 py-0.5 text-sm text-white'>
          <Heart className={cn('size-4', true && 'fill-destructive text-destructive')} />
          <span>{likeCompact}</span>
        </div>
      )}

      {hasDuration && (
        <div className='absolute bottom-3 right-3 rounded bg-black/80 px-1 py-0.5 text-sm font-medium text-white'>
          {formatDuration(duration)}
        </div>
      )}
    </div>
  );
};

export default PostThumbnail;
