import { MoreVertical } from 'lucide-react';

import { cn, formatCount, formatTimeDistance } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/user-avatar';

import { Thumbnail } from './thumbnail';

type ColumnCardProps = {
  user: { id: string; name: string; image: string };
  data: {
    title: string;
    thumbUrl: string | null;
    playbackUrl: string;
    duration: number;
    viewCount: number;
    createdAt: Date;
  };
  onFocusColor?: {
    darkTheme: string;
    lightTheme: string;
  };
};

const ColumnCard = ({ onFocusColor, user, data }: ColumnCardProps) => {
  return (
    <div className='group relative'>
      <div
        className={cn(
          'absolute inset-0 rounded-xl duration-150 group-hover:-m-3 group-hover:bg-[#ebe2dd]',
          !onFocusColor && 'hidden'
        )}
      />
      <div className='aspect-video overflow-hidden duration-150 hover:rounded-none sm:rounded-xl'>
        <Thumbnail
          className='group-hover:hidden'
          thumbUrl={data.thumbUrl}
          duration={data.duration}
        />
        {/* <Player className='relative hidden group-hover:block' /> */}
      </div>
      <div className='relative mt-2.5 flex'>
        <UserAvatar
          className='mx-3 size-10 sm:ml-0 sm:size-9'
          imageUrl={user.image}
          name={user.name}
        />
        <div className='flex w-full flex-col'>
          <p className='mb-1 line-clamp-2 text-base font-medium'>{data.title}</p>
          <span className='text-muted-foreground hover:text-primary text-sm duration-150'>
            {user.name}
          </span>
          <p className='text-muted-foreground mt-0.5 flex items-center text-sm'>
            {formatCount(data.viewCount)}次观看 · {formatTimeDistance(data.createdAt)}
          </p>
        </div>
        <Button size='icon' variant='ghost' className='-mr-1 -mt-1'>
          <MoreVertical />
        </Button>
      </div>
    </div>
  );
};

ColumnCard.Loading = () => (
  <div className='flex flex-col gap-3'>
    <Skeleton className='aspect-video rounded-none sm:rounded-xl' />
    <div className='flex gap-3'>
      <Skeleton className='ml-3 size-10 shrink-0 rounded-full sm:ml-0 sm:size-9' />
      <div className='flex w-full flex-col'>
        <Skeleton className='rounded-xs w-8/9 mb-1 h-6' />
        <Skeleton className='rounded-xs w-4/7 mb-2.5 h-6' />
      </div>
    </div>
  </div>
);

export { ColumnCard };
