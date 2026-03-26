import Link from 'next/link';
import { MoreHorizontal, Share2, Bookmark, Scissors, Flag } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { formatCount, formatTimeDistance } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import UserAvatar from '@/components/user-avatar';

import { OnePostTypes } from '@/modules/posts/types';
import PostLikeButton from '@/modules/likes/ui/components/post-like-button';
import FollowButton from '@/modules/follows/ui/components/follow-button';

type MetadataProps = {
  postId: string;
  data: OnePostTypes;
};

const DesktopMetadata = ({ postId, data }: MetadataProps) => {
  const { user, title, description, likeCount, likeStatus, createdAt, viewCount } = data;

  const utils = trpc.useUtils();

  return (
    <div className='hidden flex-col gap-3 pb-6 pt-3 sm:flex'>
      <h1 className='line-clamp-2 text-xl font-bold'>{title}</h1>
      <div className='flex items-center justify-between gap-6'>
        <div className='flex items-center'>
          <div className='flex items-center gap-3'>
            <Link href=''>
              <UserAvatar className='size-10' imageUrl={user.image} name={user.name} />
            </Link>
            <div className='mr-6 flex flex-col'>
              <Link href='' className='text-base font-medium'>
                {user.name}
              </Link>
              <span className='text-muted-foreground text-xs'>
                {formatCount(user.followerCount)} 位订阅者
              </span>
            </div>
          </div>
          <FollowButton
            followed={user.followed}
            userId={user.id}
            onSuccess={() => utils.posts.getOne.invalidate({ id: postId })}
          />
        </div>
        <div className='flex items-center gap-2'>
          <PostLikeButton count={likeCount} status={likeStatus} postId={postId} />
          <Button variant='secondary'>
            <Share2 className='size-5' />
            分享
          </Button>
          <ActionButton />
        </div>
      </div>
      <div className='bg-secondary cursor-pointer rounded-xl p-3 duration-300 hover:bg-[#fff5f0]'>
        <span className='text-sm font-medium'>
          {formatCount(viewCount)} 次观看 {formatTimeDistance(createdAt)}
        </span>
        <span className='line-clamp-3 break-words text-sm'>{description}</span>
        <button className='cursor-pointer text-sm font-medium'>...更多</button>
      </div>
    </div>
  );
};

DesktopMetadata.Skeleton = () => {
  return <div></div>;
};

const MobileMetadata = ({ postId, data }: MetadataProps) => {
  const { user, title, description, likeCount, likeStatus, createdAt, viewCount } = data;

  const utils = trpc.useUtils();

  return (
    <div className='block sm:hidden'>
      <div className='px-4 pb-2 pt-4'>
        <h1 className='line-clamp-2 text-lg font-medium'>{title}</h1>
        <div className='text-muted-foreground mt-0.5 text-xs'>
          <span className='line-clamp-1'>
            {formatCount(viewCount)} 次观看&nbsp;·&nbsp;{formatTimeDistance(createdAt)}{' '}
            {description}
          </span>
        </div>
      </div>
      <div className='flex items-center justify-between px-4 py-2'>
        <div className='flex items-center gap-3'>
          <Link href=''>
            <UserAvatar className='size-9' imageUrl={user.image} name={user.name} />
          </Link>
          <div className='flex flex-col'>
            <Link href='' className='text-sm font-medium sm:text-base'>
              {user.name}
            </Link>
            <span className='text-muted-foreground text-xs'>
              {formatCount(user.followerCount)} 位订阅者
            </span>
          </div>
        </div>
        <FollowButton
          followed={user.followed}
          userId={user.id}
          onSuccess={() => utils.posts.getOne.invalidate({ id: postId })}
        />
      </div>
      <div className='flex items-center gap-2 overflow-x-scroll px-4 py-2 [scrollbar-width:none]'>
        <PostLikeButton count={likeCount} status={likeStatus} postId={postId} />
        <Button variant='secondary'>
          <Share2 className='size-5' />
          分享
        </Button>
        <Button className='hidden sm:inline-flex' variant='secondary'>
          <Scissors className='size-5' />
          剪辑
        </Button>
        <Button className='hidden sm:inline-flex' size='icon' variant='secondary'>
          <MoreHorizontal />
        </Button>
        <Button className='inline-flex sm:hidden' variant='secondary'>
          <Bookmark className='size-5' />
          保存
        </Button>
        <Button className='inline-flex sm:hidden' variant='secondary'>
          <Flag className='size-5' />
          举报
        </Button>
      </div>
    </div>
  );
};

const ActionButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' size='icon' className='size-9'>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='rounded-xl border-none' align='end' side='bottom'>
        <DropdownMenuItem asChild>
          <Link href='/studio/create'>
            <Bookmark className='size-4.5 text-black' />
            保存
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/studio/playlist'>
            <Scissors className='size-4.5 text-black' />
            剪辑
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/studio/live-stream'>
            <Flag className='size-4.5 text-black' />
            举报
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { DesktopMetadata, MobileMetadata };
