import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration } from '@/lib/utils';
import Image from 'next/image';

type VideoThumbnailProps = {
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
  title: string;
  duration: number;
};

const VideoThumbnail = ({ thumbnailUrl, previewUrl, title, duration }: VideoThumbnailProps) => {
  return (
    <div className='relative group'>
      <div className='relative overflow-hidden aspect-video w-full rounded-xl'>
        {duration ? (
          <>
            <Image
              src={thumbnailUrl ?? '/placeholder.svg'}
              alt={title}
              fill
              className='size-full object-cover group-hover:opacity-0 transition-all'
            />
            <Image
              unoptimized={!!previewUrl}
              src={previewUrl ?? '/placeholder.svg'}
              alt={title}
              fill
              className='size-full object-cover opacity-0 group-hover:opacity-100 transition-all'
            />
          </>
        ) : (
          <Image
            src={thumbnailUrl ?? '/placeholder.svg'}
            alt={title}
            fill
            className='size-full object-cover'
          />
        )}
      </div>
      <div className='absolute bottom-2 right-2 px-1 py-0.5 bg-black/80 text-white text-xs rounded font-medium'>
        {formatDuration(duration)}
      </div>
    </div>
  );
};

const VideoThumbnailSkeleton = () => {
  return (
    <div className='relative w-full overflow-hidden transition-all rounded-xl aspect-video'>
      <Skeleton className='size-full' />
    </div>
  );
};

VideoThumbnail.Skeleton = VideoThumbnailSkeleton;

export default VideoThumbnail;
