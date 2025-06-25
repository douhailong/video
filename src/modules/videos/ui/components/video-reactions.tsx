import { ThumbsUpIcon, ThumbsDownIcon } from 'lucide-react';
import { useClerk } from '@clerk/nextjs';

import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import type { MixVideoTypes } from '../../types';

type VideoReactionsProps = {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: MixVideoTypes['viewerReactions'];
};

const VideoReactions = ({ videoId, likes, dislikes, viewerReaction }: VideoReactionsProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const like = trpc.videoReactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn();
      }
    }
  });

  const dislike = trpc.videoReactions.dislike.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn();
      }
    }
  });

  return (
    <div className='flex items-center flex-none'>
      <Button
        onClick={() => like.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        variant='secondary'
        className='rounded-l-full rounded-r-none gap-2'
      >
        <ThumbsUpIcon className={cn('size-5', viewerReaction === 'like' && 'fill-black')} />
        {likes}
      </Button>
      <Separator orientation='vertical' className='!h-7' />
      <Button
        onClick={() => dislike.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        variant='secondary'
        className='rounded-r-full rounded-l-none gap-2'
      >
        <ThumbsDownIcon className={cn('size-5', viewerReaction === 'dislike' && 'fill-black')} />
        {dislikes}
      </Button>
    </div>
  );
};

export default VideoReactions;
