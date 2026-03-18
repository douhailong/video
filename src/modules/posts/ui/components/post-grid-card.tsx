import Link from 'next/link';
import { MoreVertical } from 'lucide-react';

import { formatTimeDistance } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/user-avatar';

import PostThumbnail from './post-thumbnail';
import { ManyPostTypes } from '@/modules/home/types';

type PostGridCardProps = {
  title: string;
  createdAt: Date;
  user: ManyPostTypes['items'][number]['user'];
};

const PostGridCard = ({ title, createdAt, user }: PostGridCardProps) => {
  return (
    <div className='group relative'>
      <div className='absolute inset-0 rounded-lg duration-300 group-hover:-m-3 group-hover:bg-[#ebe2dd]' />
      <div className='relative flex flex-col gap-3'>
        <PostThumbnail
          className='rounded-none group-hover:rounded-none sm:rounded-lg'
          imageUrl='/placeholder.svg'
          alt='Thumbnail'
        />
        <div className='flex'>
          <UserAvatar
            className='mx-3 size-10 sm:ml-0 sm:size-9'
            imageUrl={user.image}
            name={user.name}
          />
          <div className='flex flex-col'>
            <h4 className='mb-1 line-clamp-2 text-sm font-medium sm:mb-1.5 sm:text-base'>
              {title}
            </h4>
            <div
              className='text-muted-foreground hover:text-primary flex self-start text-xs duration-150 sm:text-sm'
              // href=''
            >
              {user.name} &nbsp;·&nbsp; {formatTimeDistance(createdAt)}
            </div>
          </div>
          <Button size='icon' variant='ghost'>
            <MoreVertical />
          </Button>
        </div>
      </div>
    </div>
  );
};

PostGridCard.Skeleton = () => {
  return null;
  return (
    <div className='flex flex-col gap-3'>
      <Skeleton className='aspect-video rounded-lg' />
      <div className='flex gap-3'>
        <Skeleton className='ml-3 size-10 shrink-0 rounded-full sm:ml-0 sm:size-9' />
        <div className='flex w-full flex-col'>
          <Skeleton className='rounded-xs w-8/9 mb-1 h-6' />
          <Skeleton className='rounded-xs w-4/7 mb-2.5 h-6' />
        </div>
      </div>
    </div>
  );
};

export default PostGridCard;
