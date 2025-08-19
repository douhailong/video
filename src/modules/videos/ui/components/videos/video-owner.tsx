import Link from 'next/link';

import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/user-avatar';

import { useSubscription } from '@/modules/subscriptions/hooks/use-subscription';
import type { OneVideoTypes } from '@/modules/videos/types';
import SubscriptionButton from '@/modules/subscriptions/ui/components/subscription-button';

type VideoOwnerProps = {
  user: OneVideoTypes['user'];
  videoId: string;
};

const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { onClick, isPending } = useSubscription({
    userId: user.id,
    fromVideoId: videoId,
    isSubscribed: user.viewerSubscribed
  });

  return (
    <div className='flex w-full items-center justify-between gap-3 sm:justify-start'>
      <Link href={`/user/${user.id}`}>
        <div className='flex items-center gap-3'>
          <UserAvatar size='lg' imageUrl={user.image} name={user.name} />
          <div className='flex flex-col gap-0.5'>
            <p className='line-clamp-1 font-semibold text-gray-800'>{user.name}</p>
            <span className='text-muted-foreground line-clamp-1 text-xs'>
              {user.subscriberCount} 粉丝
            </span>
          </div>
        </div>
      </Link>
      {false ? (
        <Button variant='secondary' className='rounded-full' asChild>
          <Link href={`/studio/videos/${videoId}`}>编辑视频</Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={onClick}
          isSubscribed={user.viewerSubscribed}
          disabled={isPending}
          className='flex-none'
        />
      )}
    </div>
  );
};

export default VideoOwner;
