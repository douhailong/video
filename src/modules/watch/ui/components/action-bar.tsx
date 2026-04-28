'use client';

import Link from 'next/link';
import { MoreHorizontal, Share2, Bookmark, Scissors, Flag } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { formatCount, formatTimeDistance } from '@/lib/utils';
import { OnePostTypes } from '@/modules/posts/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/user-avatar';
import FollowButton from '@/modules/follows/ui/components/follow-button';
import PostLikeButton from '@/modules/likes/ui/components/post-like-button';

type ActionBarProps = { postId: string };

export default function ActionBar({ postId }: ActionBarProps) {
  const [data, query] = trpc.posts.home.getOne.useSuspenseQuery({ id: postId });

  const onSuccess = () => query.refetch();

  return (
    <>
      <DestopBar data={data} onSuccess={onSuccess} />
      <MobileBar data={data} onSuccess={onSuccess} />
    </>
  );
}

type ActionProps = {
  data: OnePostTypes;
  onSuccess: () => void;
};

function DestopBar({ data: { user, ...data }, onSuccess }: ActionProps) {
  return (
    <div className='hidden pb-6 pt-4 sm:block'>
      <h1 className='line-clamp-2 text-2xl font-bold'>{data.title}</h1>
      <div className='flex items-center justify-between pt-3'>
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
          <FollowButton followed={user.followed} userId={user.id} onSuccess={onSuccess} />
        </div>
        <div className='flex items-center gap-2'>
          <PostLikeButton
            count={data.likeCount}
            status={data.likeStatus}
            postId={data.id}
          />
          <Button variant='secondary'>
            <Share2 className='size-6' />
            分享
          </Button>
          <ActionButton />
        </div>
      </div>
    </div>
  );
}

function MobileBar({ data: { user, ...data }, onSuccess }: ActionProps) {
  return (
    <div className='flex flex-col gap-3 px-4 pb-4 pt-3 sm:hidden'>
      <h1 className='line-clamp-2 text-xl font-medium'>{data.title}</h1>
      <div className='flex items-center justify-between'>
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
        <FollowButton followed={user.followed} userId={user.id} onSuccess={onSuccess} />
      </div>
      <div className='flex items-center gap-2 overflow-x-scroll [scrollbar-width:none]'>
        <PostLikeButton
          count={data.likeCount}
          status={data.likeStatus}
          postId={data.id}
        />
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
}

function ActionButton() {
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
            <Bookmark className='size-6 text-black' />
            保存
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/studio/playlist'>
            <Scissors className='size-6 text-black' />
            剪辑
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/studio/live-stream'>
            <Flag className='size-6 text-black' />
            举报
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
