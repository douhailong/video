'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { cn } from '@/lib/utils';
import { likeStatus } from '@/db/schema';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type PostLikeButtonProps = {
  postId: string;
  count: number;
  status: (typeof likeStatus.enumValues)[number] | null;
};

const PostLikeButton = ({ postId, count, status }: PostLikeButtonProps) => {
  const utils = trpc.useUtils();

  const likeMutation = trpc.like.post.like.useMutation({
    onSuccess: () => utils.posts.getOne.invalidate({ id: postId })
  });
  const dislikeMutation = trpc.like.post.dislike.useMutation({
    onSuccess: () => utils.posts.getOne.invalidate({ id: postId })
  });

  const isLoading = likeMutation.isPending || dislikeMutation.isPending;

  return (
    <div className='flex flex-none items-center'>
      <Button
        variant='secondary'
        className='gap-2 rounded-r-none'
        onClick={() => {
          if (!isLoading) likeMutation.mutate({ postId });
        }}
      >
        <ThumbsUp className={cn('size-5', status === 'like' && 'fill-black')} />
        {count}
      </Button>
      <Separator orientation='vertical' className='!h-7' />
      <Button
        variant='secondary'
        className='gap-2 rounded-l-none'
        onClick={() => {
          if (!isLoading) dislikeMutation.mutate({ postId });
        }}
      >
        <ThumbsDown className={cn('size-5', status === 'dislike' && 'fill-black')} />
      </Button>
    </div>
  );
};

export default PostLikeButton;
