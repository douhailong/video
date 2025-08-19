import Image from 'next/image';

import { Skeleton } from '@/components/ui/skeleton';

import { formatDuration } from '@/lib/utils';

type VideoThumbnailProps = {
  thumbnailUrl?: string;
  title: string;
  duration: number;
};

const VideoThumbnail = ({ thumbnailUrl, title, duration }: VideoThumbnailProps) => {
  return (
    <div className='group relative'>
      <div className='relative aspect-video w-full overflow-hidden rounded-xl'>
        <Image
          src={thumbnailUrl ?? '/placeholder.svg'}
          alt={title}
          fill
          className='size-full object-cover transition-all '
        />
        {/* <Image
          src={thumbnailUrl ?? '/placeholder.svg'}
          alt={title}
          fill
          className='size-full object-cover transition-all group-hover:opacity-0'
        />
        <Image
          unoptimized={!!previewUrl}
          src={previewUrl ?? '/placeholder.svg'}
          alt={title}
          fill
          className='size-full object-cover opacity-0 transition-all group-hover:opacity-100'
        /> */}
      </div>
      <div className='absolute bottom-2 right-2 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white'>
        {formatDuration(duration)}
      </div>
    </div>
  );
};

const VideoThumbnailSkeleton = () => {
  return (
    <div className='relative aspect-video w-full overflow-hidden rounded-xl transition-all'>
      <Skeleton className='size-full' />
    </div>
  );
};

VideoThumbnail.Skeleton = VideoThumbnailSkeleton;

export default VideoThumbnail;
