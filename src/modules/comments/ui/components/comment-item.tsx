import Link from 'next/link';
import { toast } from 'sonner';
import {
  MessageSquare,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
  MessageCircleMoreIcon
} from 'lucide-react';

import { trpc } from '@/trpc/client';
import { cn, formatTimeDistance } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu';
import UserAvatar from '@/components/user-avatar';

import { ManyCommentTypes } from '../../types';

type CommentItemProps = {
  comment: ManyCommentTypes['items'][number];
};

const CommentItem = ({ comment }: CommentItemProps) => {
  const utils = trpc.useUtils();

  const remove = trpc.comments.remove.useMutation({
    onSuccess: () => {
      toast.success('Comment deleted');
      utils.comments.getMany.invalidate({ postId: comment.postId });
    }
  });

  const like = trpc.commentReactions.like.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ postId: comment.postId });
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
      }
    }
  });

  const dislike = trpc.commentReactions.dislike.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ postId: comment.postId });
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
              {formatTimeDistance(comment.createdAt)}
            </span>
          </div>
          <p className='text-sm' title={comment.content}>
            {comment.content}
          </p>
          <div className='-ml-2 mt-1 flex items-center gap-1'>
            <Button
              onClick={() => like.mutate({ commentId: comment.id })}
              disabled={like.isPending || dislike.isPending}
              variant='ghost'
              size='icon'
              className='size-8'
            >
              <ThumbsUpIcon className={cn(comment.reaction === 'like' && 'fill-black')} />
            </Button>
            <span className='text-muted-foreground text-xs'>{comment.likes}</span>
            <Button
              onClick={() => dislike.mutate({ commentId: comment.id })}
              disabled={like.isPending || dislike.isPending}
              variant='ghost'
              size='icon'
              className='size-8'
            >
              <ThumbsDownIcon
                className={cn(comment.reaction === 'dislike' && 'fill-black')}
              />
            </Button>
            <span className='text-muted-foreground text-xs'>{comment.dislikes}</span>
            <Button
              onClick={() => dislike.mutate({ commentId: comment.id })}
              disabled={like.isPending || dislike.isPending}
              variant='ghost'
              size='icon'
              className='size-8'
            >
              <MessageCircleMoreIcon />
            </Button>
            <span className='text-muted-foreground text-xs'>回复</span>
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
