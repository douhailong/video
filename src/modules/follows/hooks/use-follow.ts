import { toast } from 'sonner';
import { trpc } from '@/trpc/client';

type UseFollowProps = {
  followingId: string;
  isFollowed: boolean;
  onSuccess: () => void;
};

export const useFollow = ({ followingId, onSuccess, isFollowed }: UseFollowProps) => {
  const follow = trpc.follows.follow.useMutation({
    onSuccess: () => {
      toast.success('Subscribed');
      onSuccess();
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
      }
    }
  });

  const unfollow = trpc.follows.unfollow.useMutation({
    onSuccess: () => {
      toast.success('Unsubscribed');
      onSuccess();
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
      }
    }
  });

  const isPending = follow.isPending || unfollow.isPending;

  const onClick = () => {
    isFollowed
      ? unfollow.mutate({ id: followingId })
      : follow.mutate({ id: followingId });
  };

  return { isPending, onClick };
};
