import { useMemo } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

import VideoThumbnail from './video-thumbnail';
import { MixManyVideoTypes } from '../../types';
import UserAvatar from '@/components/user-avatar';
import UserInfo from '@/modules/users/ui/components/user-info';
import VideoMenu from './video-menu';

type VideoGridCardProps = {
  data: MixManyVideoTypes['items'][number];
  onRemove?: () => void;
};

const VideoGridCard = ({ data, onRemove }: VideoGridCardProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat('en', { notation: 'compact' }).format(data.viewCount);
  }, [data.viewCount]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(data.createdAt, { addSuffix: true });
  }, [data.createdAt]);

  return (
    <div className='group flex w-full flex-col gap-2'>
      <Link href={`/videos/${data.id}`}>
        <VideoThumbnail
          thumbnailUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
          title={data.title}
          duration={data.duration}
        />
      </Link>
      <div className='flex gap-3'>
        <Link href={`/users/${data.user.id}`}>
          <UserAvatar imageUrl={data.user.imageUrl} name={data.user.name} />
        </Link>
        <div className='flex-1'>
          <Link href={`/videos/${data.id}`}>
            <h3 className='line-clamp-1 break-words text-base font-medium lg:line-clamp-2'>
              {data.title}
            </h3>
          </Link>
          <Link href={`/users/${data.user.id}`}>
            <UserInfo name={data.user.name} />
          </Link>
          <Link href={`/videos/${data.id}`}>
            <p className='line-clamp-1 text-sm text-gray-600'>
              {compactViews} views ● {compactDate}
            </p>
          </Link>
        </div>
        <div className='flex-shrink-0'>
          *{/* <VideoMenu videoId={data.id} onRemove={onRemove} /> */}
        </div>
      </div>
    </div>
  );
};

export default VideoGridCard;
