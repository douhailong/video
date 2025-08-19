import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  MessageSquare,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon
} from 'lucide-react';

import { trpc } from '@/trpc/client';
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/user-avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu';

import { MixCommentTypes } from '../../types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type CommentItemProps = {
  comment: MixCommentTypes['items'][number];
};

const CommentItem = ({ comment }: CommentItemProps) => {
  const utils = trpc.useUtils();

  const remove = trpc.comments.remove.useMutation({
    onSuccess: () => {
      toast.success('Comment deleted');
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    }
  });

  const like = trpc.commentReactions.like.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
      }
    }
  });

  const dislike = trpc.commentReactions.dislike.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
      }
    }
  });

  return (
    <div>
      <div className='flex gap-4'>
        <Link href={`/users/${comment.authorId}`}>
          <UserAvatar size='lg' imageUrl={comment.user.image} name={comment.user.name} />
        </Link>
        <div className='flex-1'>
          <div className='mb-0.5 flex items-center gap-2'>
            <span className='pb-0.5 text-sm font-medium'>{comment.user.name}</span>
            <span className='text-muted-foreground text-xs'>
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </span>
          </div>
          <p className='text-sm'>{comment.value}</p>
          <div className='mt-1 flex items-center gap-2'>
            <div className='flex items-center'>
              <Button
                onClick={() => like.mutate({ commentId: comment.id })}
                disabled={like.isPending || dislike.isPending}
                variant='ghost'
                size='icon'
                className='size-8'
              >
                <ThumbsUpIcon className={cn(comment.viewerReaction === 'like' && 'fill-black')} />
              </Button>
              <span className='text-muted-foreground text-xs'>{comment.likeCount}</span>
              <Button
                onClick={() => dislike.mutate({ commentId: comment.id })}
                disabled={like.isPending || dislike.isPending}
                variant='ghost'
                size='icon'
                className='size-8'
              >
                <ThumbsDownIcon
                  className={cn(comment.viewerReaction === 'dislike' && 'fill-black')}
                />
              </Button>
              <span className='text-muted-foreground text-xs'>{comment.dislikeCount}</span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='size-8'>
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>
              <MessageSquare className='size-4' />
              Reply
            </DropdownMenuItem>
            {true && (
              <DropdownMenuItem onClick={() => remove.mutate({ id: comment.id })}>
                <Trash2Icon className='size-4' />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CommentItem;
