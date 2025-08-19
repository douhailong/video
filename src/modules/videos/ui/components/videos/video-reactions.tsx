import { ThumbsUpIcon, ThumbsDownIcon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import type { OneVideoTypes } from '@/modules/videos/types';

type VideoReactionsProps = {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: OneVideoTypes['viewerReaction'];
};

const VideoReactions = ({ videoId, likes, dislikes, viewerReaction }: VideoReactionsProps) => {
  const utils = trpc.useUtils();

  const like = trpc.videoReactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        // TODO 弹出登录窗
      }
    }
  });

  const dislike = trpc.videoReactions.dislike.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
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
        onClick={() => like.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        variant='secondary'
        className='gap-2 rounded-l-full rounded-r-none'
      >
        <ThumbsUpIcon className={cn('size-5', viewerReaction === 'like' && 'fill-black')} />
        {likes}
      </Button>
      <Separator orientation='vertical' className='!h-7' />
      <Button
        onClick={() => dislike.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        variant='secondary'
        className='gap-2 rounded-l-none rounded-r-full'
      >
        <ThumbsDownIcon className={cn('size-5', viewerReaction === 'dislike' && 'fill-black')} />
        {dislikes}
      </Button>
    </div>
  );
};

export default VideoReactions;
