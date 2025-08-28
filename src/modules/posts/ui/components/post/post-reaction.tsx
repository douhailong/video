import { ThumbsUpIcon, ThumbsDownIcon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import type { OnePostTypes } from '@/modules/posts/types';

type PostReactionsProps = {
  postId: string;
  likes: number;
  dislikes: number;
  reaction: OnePostTypes['reaction'];
};

const PostReactions = ({ postId, likes, dislikes, reaction }: PostReactionsProps) => {
  const utils = trpc.useUtils();

  const like = trpc.postReactions.like.useMutation({
    onSuccess: () => {
      utils.posts.getOne.invalidate({ id: postId });
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        // TODO 弹出登录窗
      }
    }
  });

  const dislike = trpc.postReactions.dislike.useMutation({
    onSuccess: () => {
      utils.posts.getOne.invalidate({ id: postId });
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        // TODO 弹出登录窗
      }
    }
  });

  return (
    <div className='flex flex-none items-center'>
      <Button
        onClick={() => like.mutate({ postId })}
        disabled={like.isPending || dislike.isPending}
        variant='secondary'
        className='gap-2 rounded-l-full rounded-r-none'
      >
        <ThumbsUpIcon className={cn('size-5', reaction === 'like' && 'fill-black')} />
        {likes}
      </Button>
      <Separator orientation='vertical' className='!h-7' />
      <Button
        onClick={() => dislike.mutate({ postId })}
        disabled={like.isPending || dislike.isPending}
        variant='secondary'
        className='gap-2 rounded-l-none rounded-r-full'
      >
        <ThumbsDownIcon
          className={cn('size-5', reaction === 'dislike' && 'fill-black')}
        />
        {dislikes}
      </Button>
    </div>
  );
};

export default PostReactions;
