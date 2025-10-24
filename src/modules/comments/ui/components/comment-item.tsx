import { useState } from 'react';
import Link from 'next/link';
import {
  type LucideIcon,
  MoreVertical,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  TriangleAlert,
  UserRoundX,
  ChevronDown,
  ChevronUp,
  AtSign
} from 'lucide-react';

import { trpc } from '@/trpc/client';
import { cn, formatTimeDistance } from '@/lib/utils';
import { DEFAULT_LIMIT } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu';
import UserAvatar from '@/components/user-avatar';

import CommentForm from './comment-form';
import { ManyCommentTypes } from '../../types';
import Boundary from '@/components/boundary';

type CommentItemProps = {
  parentId?: string;
  comment: ManyCommentTypes['items'][number];
  feedbackId: string | null;
  onOpenFeedback: (commentId: string) => void;
  onSuccess: () => void;
};

const CommentItem = ({
  parentId,
  comment,
  feedbackId,
  onOpenFeedback,
  onSuccess
}: CommentItemProps) => {
  const utils = trpc.useUtils();

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

  const remove = trpc.comments.remove.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ postId: comment.postId });
    }
  });

  return (
    <div className='flex gap-3'>
      <Link href={`/users/${comment.authorId}`}>
        <UserAvatar
          size={parentId ? 'sm' : 'lg'}
          imageUrl={comment.user.image}
          name={comment.user.name}
        />
      </Link>
      <div className='flex flex-1 flex-col gap-1'>
        <div className='text-muted-foreground flex items-center gap-1 text-xs'>
          <Link href={`/users/${comment.authorId}`}>{comment.user.name}</Link>
          <AtSign className='size-2.5' />
          <Link href={`/users/${comment.authorId}`}>{comment.user.name}</Link>
        </div>
        <p
          className='line-clamp-4 whitespace-pre-line break-all text-sm'
          title={comment.content}
        >
          {comment.content}
        </p>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground text-xs'>
              {formatTimeDistance(comment.createdAt)}
            </span>
            <ReactionButton
              onClick={() => like.mutate({ commentId: comment.id })}
              disabled={like.isPending || dislike.isPending}
              text={comment.likes}
              icon={ThumbsUp}
              isFill={comment.reaction === 'like'}
            />
            <ReactionButton
              onClick={() => dislike.mutate({ commentId: comment.id })}
              disabled={like.isPending || dislike.isPending}
              text={comment.dislikes}
              icon={ThumbsDown}
              isFill={comment.reaction === 'dislike'}
            />
            <button
              onClick={() => onOpenFeedback(comment.id)}
              className='text-muted-foreground hover:text-foreground cursor-pointer rounded-full text-xs transition-all'
            >
              {comment.id === feedbackId ? '取消回复' : '回复'}
            </button>
          </div>
          <DropdownButton
            onDelete={() => remove.mutate({ id: comment.id })}
            onBlacklist={() => remove.mutate({ id: comment.id })}
            onFeedback={() => remove.mutate({ id: comment.id })}
          />
        </div>
        {comment.id === feedbackId && (
          <CommentForm
            onSuccess={onSuccess}
            parentId={parentId || comment.id}
            feedbackId={parentId && feedbackId ? feedbackId : undefined}
            postId={comment.postId}
          />
        )}
        {!parentId && !!comment.comments && (
          <SubComments
            count={comment.comments}
            postId={comment.postId}
            parentId={comment.id}
            feedbackId={feedbackId}
            onOpenFeedback={(commentId) => onOpenFeedback(commentId)}
            onSuccess={onSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default CommentItem;

type SubCommentsProps = {
  feedbackId: string | null;
  postId: string;
  parentId: string;
  count: number;
  onOpenFeedback: (commentId: string) => void;
  onSuccess: () => void;
};

// const SubComments = (props: SubCommentsProps) => {
//   return (
//     <Boundary fallback={<p>loading...</p>}>
//       <SubCommentsSuspense {...props} />
//     </Boundary>
//   );
// };

const SubComments = ({
  postId,
  parentId,
  count,
  onOpenFeedback,
  feedbackId,
  onSuccess
}: SubCommentsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data, fetchNextPage } = trpc.comments.getMany.useInfiniteQuery(
    {
      postId,
      parentId,
      limit: Math.round(DEFAULT_LIMIT / 2)
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor, enabled: !!isOpen }
  );

  const comments = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div>
      <div className={cn('flex flex-col gap-1', !isOpen && 'hidden')}>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            parentId={parentId}
            feedbackId={feedbackId}
            onOpenFeedback={() => onOpenFeedback(comment.id)}
            onSuccess={onSuccess}
          />
        ))}
      </div>
      <OpenButton
        count={count}
        comments={comments.length}
        onClick={async () => {
          if (comments.length === count) return setIsOpen(!isOpen);
          await fetchNextPage();
          setIsOpen(true);
        }}
        isOpen={isOpen}
      />
    </div>
  );
};

type ReactionButtonProps = {
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  text?: string | number;
  isFill?: boolean;
};

const ReactionButton = ({
  icon: Icon,
  onClick,
  disabled,
  text,
  isFill
}: ReactionButtonProps) => {
  return (
    <div className='flex items-center gap-0.5'>
      <Button onClick={onClick} disabled={disabled} variant='ghost' size='icon'>
        <Icon className={cn('size-3.5', isFill && 'fill-black')} />
      </Button>
      <span className='text-muted-foreground text-xs'>{text || null}</span>
    </div>
  );
};

type OpenButtonProps = {
  isOpen: boolean;
  count: number;
  comments: number;
  onClick: () => void;
};

const OpenButton = ({ isOpen, count, comments, onClick }: OpenButtonProps) => {
  if (isOpen && comments === count) {
    return (
      <button
        className='text-muted-foreground flex cursor-pointer items-center gap-1 text-xs'
        onClick={onClick}
      >
        收起
        <ChevronUp className='size-4' />
      </button>
    );
  }

  return (
    <button
      className='text-muted-foreground flex cursor-pointer items-center gap-1 text-xs'
      onClick={onClick}
    >
      展开{comments === 0 ? ` ${count} 条回复` : '更多'}
      <ChevronDown className='size-4' />
    </button>
  );
};

type DropdownButtonProps = {
  onDelete: () => void;
  onBlacklist: () => void;
  onFeedback: () => void;
};

const DropdownButton = ({ onDelete, onBlacklist, onFeedback }: DropdownButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='size-8'>
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={onFeedback}>
          <TriangleAlert className='size-4' />
          举报
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onBlacklist}>
          <UserRoundX className='size-4' />
          拉黑
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>
          <Trash2 className='size-4' />
          删除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
