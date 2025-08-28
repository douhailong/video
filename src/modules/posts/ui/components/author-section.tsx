import Link from 'next/link';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/user-avatar';

import type { OnePostTypes } from '@/modules/posts/types';
import FollowButton from '@/modules/follows/ui/components/follow-button';
import Menu from './post/post-menu';
import PostReaction from './post/post-reaction';

type AuthorSectionProps = {
  user: OnePostTypes['user'];
  postId: string;
};

const AuthorSection = ({ user, postId }: AuthorSectionProps) => {
  return (
    <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center'>
      <div className='flex w-full items-center gap-4'>
        <Link href={`/user/${user.id}`} className='flex items-center gap-3'>
          <UserAvatar size='lg' imageUrl={user.image} name={user.name} />
          <div className='flex flex-col'>
            <p className='line-clamp-1 font-semibold'>{user.name}</p>
            <span className='text-muted-foreground text-xs'>{user.follows} 粉丝</span>
          </div>
        </Link>
        {false ? (
          <Button variant='secondary' className='rounded-full' asChild>
            <Link href={`/studio/posts/${postId}`}>编辑视频</Link>
          </Button>
        ) : (
          <FollowButton
            // onClick={onClick}
            isFollowed={user.followed}
            // disabled={isPending}
            className='flex-none'
          />
        )}
        <PostReaction postId={''} likes={10} dislikes={1000} reaction={'dislike'} />
      </div>
      <div>
        <Menu />
      </div>
    </div>
  );
};

export default AuthorSection;
