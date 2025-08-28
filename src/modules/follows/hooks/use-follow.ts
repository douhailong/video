import { toast } from 'sonner';
import { trpc } from '@/trpc/client';

type UseFollowProps = {
  userId: string;
  fromVideoId?: string;
  isFollowed: boolean;
};

export const useFollow = ({ userId, fromVideoId, isFollowed }: UseFollowProps) => {
  const utils = trpc.useUtils();

  const follow = trpc.follows.follow.useMutation({
    onSuccess: () => {
      toast.success('Subscribed');
      if (fromVideoId) {
        utils.posts.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
      }
    }
  });

  const unfollow = trpc.follows.unfollow.useMutation({
    onSuccess: () => {
      toast.success('Unsubscribed');
      if (fromVideoId) {
        utils.posts.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
      }
    }
  });

  const isPending = follow.isPending || unfollow.isPending;

  const onClick = () => {
    isFollowed ? unfollow.mutate({ id: userId }) : follow.mutate({ id: userId });
  };

  return { isPending, onClick };
};
