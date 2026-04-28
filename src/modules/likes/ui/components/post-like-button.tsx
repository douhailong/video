'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { cn } from '@/lib/utils';
import { LikeStatus } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { usePostLike } from '@/modules/likes/hooks/use-post-like';

type PostLikeButtonProps = {
  postId: string;
  count: number;
  status: LikeStatus | null;
};

const PostLikeButton = ({ postId, count, status }: PostLikeButtonProps) => {
  const utils = trpc.useUtils();

  const { isPending, onClick } = usePostLike({
    postId,
    onSuccess: () => {
      utils.posts.home.getOne.invalidate({ id: postId });
      utils.posts.home.getMany.invalidate();
    }
  });

  return (
    <div className='flex flex-none items-center'>
      <Button
        variant='secondary'
        className='gap-2 rounded-r-none'
        onClick={() => !isPending && onClick.like()}
      >
        <ThumbsUp className={cn('size-6', status === 'like' && 'fill-black')} />
        {count}
      </Button>
      <Separator orientation='vertical' className='!h-7' />
      <Button
        variant='secondary'
        className='gap-2 rounded-l-none'
        onClick={() => !isPending && onClick.dislike()}
      >
        <ThumbsDown className={cn('size-6', status === 'dislike' && 'fill-black')} />
      </Button>
    </div>
  );
};

export default PostLikeButton;
