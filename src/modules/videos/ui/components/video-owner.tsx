import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/user-avatar';
import UserInfo from '@/modules/users/ui/components/user-info';
import SubscriptionButton from '@/modules/subscriptions/ui/components/subscription-button';
import { useSubscription } from '@/modules/subscriptions/hooks/use-subscription';

import { MixVideoTypes } from '../../types';

type VideoOwnerProps = {
  user: MixVideoTypes['user'];
  videoId: string;
};

const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { userId: clerkUserId, isLoaded } = useAuth();

  const { onClick, isPending } = useSubscription({
    userId: user.id,
    fromVideoId: videoId,
    isSubscribed: user.viewerSubscribed
  });

  return (
    <div className='flex items-center justify-between sm:items-start sm:justify-start gap-3'>
      <Link href={`/user/${user.id}`}>
        <div className='flex items-center gap-3'>
          <UserAvatar size='lg' imageUrl={user.imageUrl} name={user.name} />
          <div className='flex flex-col gap-0.5'>
            <UserInfo size='lg' name={user.name} />
            <span className='text-sm text-muted-foreground line-clamp-1'>
              {user.subscriberCount} subscribers
            </span>
          </div>
        </div>
      </Link>
      {clerkUserId === user.clerkId ? (
        <Button variant='secondary' className='rounded-full' asChild>
          <Link href={`/studio/videos/${videoId}`}>Edit video</Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={onClick}
          isSubscribed={user.viewerSubscribed}
          disabled={isPending || !isLoaded}
          className='flex-none'
        />
      )}
    </div>
  );
};

export default VideoOwner;
