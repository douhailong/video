import { trpc } from '@/trpc/client';

type UsePostLikeProps = {
  postId: string;
  onSuccess: () => void;
};

export const usePostLike = ({ postId, onSuccess }: UsePostLikeProps) => {
  const like = trpc.likes.post.like.useMutation({
    onSuccess: () => onSuccess(),
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
      }
    }
  });

  const dislike = trpc.likes.post.dislike.useMutation({
    onSuccess: () => onSuccess(),
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
      }
    }
  });

  const isPending = like.isPending || dislike.isPending;

  const onClick = {
    dislike: () => dislike.mutate({ postId }),
    like: () => like.mutate({ postId })
  };

  return { isPending, onClick };
};
