import { trpc } from '@/trpc/client';

type UseFollowProps = {
  followerId: string;
  followed: boolean;
  onSuccess: () => void;
};

export const useFollow = ({ followerId, onSuccess, followed }: UseFollowProps) => {
  const follow = trpc.follows.follow.useMutation({
    onSuccess: () => {
      onSuccess();
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
      }
    }
  });

  const unfollow = trpc.follows.unfollow.useMutation({
    onSuccess: () => {
      onSuccess();
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
      }
    }
  });

  const isPending = follow.isPending || unfollow.isPending;

  const onClick = () => {
    followed ? unfollow.mutate({ id: followerId }) : follow.mutate({ id: followerId });
  };

  return { isPending, onClick };
};
