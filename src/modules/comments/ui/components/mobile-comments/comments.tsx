'use client';

import {
  MoreVertical,
  ChevronDown,
  ThumbsDown,
  ThumbsUp,
  MessageSquareText
} from 'lucide-react';

import { cn, formatTimeDistance } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/lib/constants';
import { ManyCommentTypes } from '@/modules/comments/types';
import { Button } from '@/components/ui/button';
import InfiniteScroll from '@/components/infinite-scroll';
import Boundary from '@/components/boundary';
import UserAvatar from '@/components/user-avatar';

type CommentsProps = {
  postId: string;
  parentId?: string;
};

const Comments = ({ postId }: CommentsProps) => {
  const [data, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
      postId
    },
    { getNextPageParam: (next) => next.nextCursor }
  );

  const comments = data?.pages.flatMap((page) => page.items) || [];

  return (
    <>
      <div>
        {comments.map((comment) => (
          <CommentItem key={comment.id} postId={postId} comment={comment} />
        ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </>
  );
};

export default Comments;

type CommentItemProps = {
  postId: string;
  comment: ManyCommentTypes['items'][number];
};

const CommentItem = ({ postId, comment }: CommentItemProps) => {
  const utils = trpc.useUtils();

  const like = trpc.likes.comment.like.useMutation({
    onSuccess: () => utils.comments.getMany.invalidate({ postId })
  });
  const dislike = trpc.likes.comment.dislike.useMutation({
    onSuccess: () => utils.comments.getMany.invalidate({ postId })
  });

  const { user } = comment;

  return (
    <div className={cn('flex gap-2 px-3 py-4')}>
      <UserAvatar
        imageUrl={user.image}
        name={user.name}
        className={cn('size-12', comment.parentId && 'size-6.5')}
      />
      <div className='flex w-full flex-col'>
        <div className='text-muted-foreground flex items-center justify-between text-xs'>
          <span>{user.name}</span>
          <span>{formatTimeDistance(comment.createdAt)}</span>
        </div>
        <p className='line-clamp-3 py-1 text-sm'>{comment.text}</p>
        <div className='flex items-center justify-between py-1'>
          <div className='flex items-center gap-3'>
            <button
              className='text-muted-foreground flex items-center gap-1.5 text-xs'
              onClick={() => like.mutate({ commentId: comment.id })}
            >
              <ThumbsUp
                className={cn(
                  'size-4',
                  comment.likeStatus === 'like' && 'fill-black text-black'
                )}
              />
              <span>{comment.likeCount}</span>
            </button>
            <button
              className='text-muted-foreground flex text-xs'
              onClick={() => dislike.mutate({ commentId: comment.id })}
            >
              <ThumbsDown
                className={cn(
                  'size-4',
                  comment.likeStatus === 'dislike' && 'fill-black text-black'
                )}
              />
            </button>
            <button className='text-muted-foreground flex items-center gap-1.5 text-xs'>
              <MessageSquareText className='size-4' />
              <span>12</span>
            </button>
          </div>
          <Button size='icon' variant='ghost'>
            <MoreVertical className='text-muted-foreground size-4.5' />
          </Button>
        </div>
        {!comment.parentId && (
          <Boundary fallback={<div>sub loading...</div>}>
            <SubComments postId={postId} parentId={comment.id} />
          </Boundary>
        )}
        {!comment.parentId && <OpenButton />}
      </div>
    </div>
  );
};

const SubComments = ({ postId, parentId }: CommentsProps) => {
  const [data, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
      postId,
      parentId
    },
    { getNextPageParam: (next) => next.nextCursor }
  );

  const comments = data?.pages.flatMap((page) => page.items) || [];

  return (
    <>
      <div className='bg-red-200'>
        {comments.map((comment) => (
          <CommentItem postId={postId} comment={comment} />
        ))}
      </div>
      {/* <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      /> */}
    </>
  );
};

type OpenButtonProps = {};

const OpenButton = ({}: OpenButtonProps) => {
  return (
    <button className='text-muted-foreground relative flex items-center pl-8 pt-1 text-start text-xs'>
      <div className='bg-border absolute left-0 top-1/2 h-[1px] w-6 -translate-y-1/2' />
      展开12条回复
      <ChevronDown className='size-3.5' />
    </button>
  );
};
