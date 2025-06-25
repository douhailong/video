import { useClerk } from '@clerk/nextjs';

import { trpc } from '@/trpc/client';
import { toast } from 'sonner';

type UseSubscriptionProps = {
  userId: string;
  fromVideoId?: string;
  isSubscribed: boolean;
};

export const useSubscription = ({ userId, fromVideoId, isSubscribed }: UseSubscriptionProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const subscribe = trpc.subscriptions.subscribe.useMutation({
    onSuccess: () => {
      toast.success('Subscribed');
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn();
      }
    }
  });
  const unsubscribe = trpc.subscriptions.unsubscribe.useMutation({
    onSuccess: () => {
      toast.success('Unsubscribed');
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn();
      }
    }
  });

  const isPending = subscribe.isPending || unsubscribe.isPending;

  const onClick = () => {
    isSubscribed
      ? unsubscribe.mutate({ publisherId: userId })
      : subscribe.mutate({ publisherId: userId });
  };

  return { isPending, onClick };
};
