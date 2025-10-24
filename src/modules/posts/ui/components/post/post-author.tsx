import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/user-avatar';

import { useFollow } from '@/modules/follows/hooks/use-follow';
import FollowButton from '@/modules/follows/ui/components/follow-button';
import type { OnePostTypes } from '@/modules/posts/types';

type PostAuthorProps = {
  postId: string;
  isSelf: boolean;
  user: OnePostTypes['user'];
  onSuccess: () => void;
};

const PostAuthor = ({ postId, isSelf, user, onSuccess }: PostAuthorProps) => {
  const { onClick, isPending } = useFollow({
    followingId: user.id,
    isFollowed: user.followed,
    onSuccess
  });

  return (
    <div className='flex w-full items-center gap-5'>
      <Link href={`/user/${user.id}`} className='flex items-center gap-3'>
        <UserAvatar size='lg' imageUrl={user.image} name={user.name} />
        <div className='flex flex-col'>
          <p className='line-clamp-1 font-semibold'>{user.name}</p>
          <span className='text-muted-foreground text-xs'>{user.follows} 粉丝</span>
        </div>
      </Link>
      {isSelf ? (
        <Button variant='secondary' asChild>
          <Link href={`/studio/posts/${postId}`}>编辑视频</Link>
        </Button>
      ) : (
        <FollowButton onClick={onClick} isFollowed={user.followed} disabled={isPending} />
      )}
    </div>
  );
};

export default PostAuthor;
