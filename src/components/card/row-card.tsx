import { formatCount, formatTimeDistance } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

import ActionDropdown, { type Actions } from './action-dropdown';
import { Thumbnail } from './thumbnail';

type RowCardProps = {
  user: { id: string; name: string; image: string };
  data: {
    id: string;
    title: string;
    thumbUrl: string | null;
    playbackUrl: string;
    duration: number;
    viewCount: number;
    createdAt: Date;
  };
  actions?: Actions;
};

const RowCard = ({ data, user, actions }: RowCardProps) => {
  return (
    <div className='group flex gap-2 xl:gap-3'>
      <div className='w-3/7 aspect-video self-start overflow-hidden duration-150 hover:rounded-none sm:rounded-lg'>
        <Thumbnail
          className='group-hover:hidden'
          thumbUrl={data.thumbUrl}
          duration={data.duration}
        />
        {/* <Player className='relative hidden group-hover:block' /> */}
      </div>
      <div className='flex-1'>
        <p className='line-clamp-2 text-base font-medium'>{data.title}</p>
        <span className='text-muted-foreground hover:text-primary text-sm duration-150'>
          {user.name}
        </span>
        <p className='text-muted-foreground flex items-center text-sm'>
          {formatCount(data.viewCount)}次观看 · {formatTimeDistance(data.createdAt)}
        </p>
      </div>
      <ActionDropdown actions={actions} id={data.id} />
    </div>
  );
};

RowCard.Loading = () => (
  <div className='flex gap-2 xl:gap-3'>
    <Skeleton className='w-3/7 aspect-video sm:rounded-lg' />
    <div className='flex flex-1 flex-col gap-2'>
      <Skeleton className='rounded-xs h-5 w-full' />
      <Skeleton className='rounded-xs h-5 w-3/4' />
      <Skeleton className='rounded-xs h-4 w-1/3' />
    </div>
  </div>
);

export { RowCard };
