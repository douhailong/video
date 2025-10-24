import Image from 'next/image';

import { cn } from '@/lib/utils';
import VideoPlayer from './post-renderer/video-player';

type PostThumbnailProps = {
  className?: string;
  imageUrl: string;
  alt: string;
};

const PostThumbnail = ({ className, imageUrl, alt }: PostThumbnailProps) => {
  return (
    <div
      className={cn(
        'group relative aspect-video overflow-hidden rounded-lg duration-150',
        className
      )}
    >
      <Image className='group-hover:hidden' src={imageUrl} alt={alt} fill />
      <VideoPlayer className='hidden group-hover:block' />
    </div>
  );
};

export default PostThumbnail;
