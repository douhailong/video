import Link from 'next/link';
import { MoreVertical } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/user-avatar';

import PostThumbnail from './post-thumbnail';

type PostGridCardProps = {};

const PostGridCard = ({}: PostGridCardProps) => {
  return (
    <div className='group relative'>
      <div className='absolute inset-0 rounded-lg duration-300 group-hover:-m-3 group-hover:bg-[#ebe2dd]' />
      <div className='relative flex flex-col gap-3'>
        <PostThumbnail
          className='group-hover:rounded-none'
          imageUrl='/placeholder.svg'
          alt='Thumbnail'
        />
        <div className='flex gap-3'>
          <UserAvatar size='lg' />
          <div className='flex flex-col'>
            <h4 className='mb-1.5 line-clamp-2 font-medium'>
              『 踩坑经验分享』Claude Code 入门：Windows, Mac 安装、 AI
              专案初始化模板、Gemini CLI 适用、九大必学技巧、并列执行加速器
            </h4>
            <Link className='text-muted-foreground text-xs' href=''>
              牢大牢大
            </Link>
            <div className='text-muted-foreground text-xs'>
              <span>2.2万次观看</span>
              &nbsp;·&nbsp;
              <span>一个月前</span>
            </div>
          </div>
          <Button size='icon' variant='ghost'>
            <MoreVertical className='size-5' />
          </Button>
        </div>
      </div>
    </div>
  );
};

PostGridCard.Skeleton = () => {
  return (
    <div className='flex flex-col gap-3'>
      <Skeleton className='aspect-video rounded-lg' />
      <div className='flex gap-3'>
        <Skeleton className='size-9 shrink-0 rounded-full' />
        <div className='flex w-full flex-col'>
          <Skeleton className='rounded-xs w-8/9 mb-1 h-6' />
          <Skeleton className='rounded-xs w-4/7 mb-2.5 h-6' />
        </div>
      </div>
    </div>
  );
};

export default PostGridCard;
