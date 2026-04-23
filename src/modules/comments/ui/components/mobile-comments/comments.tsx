'use client';

import { useState } from 'react';
import { ChevronDown, HeartCrack, Heart, ChevronUp } from 'lucide-react';

import { cn, formatTimeDistance } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/lib/constants';
import { ManyCommentTypes } from '@/modules/comments/types';
import InfiniteScroll from '@/components/infinite-scroll';
import Boundary from '@/components/boundary';
import UserAvatar from '@/components/user-avatar';

type CommentsProps = {
  postId: string;
  onClick: ({ pid, rid }: { pid: string | null; rid: string }) => void;
};

const Comments = ({ postId, onClick }: CommentsProps) => {
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
          <CommentItem
            key={comment.id}
            postId={postId}
            comment={comment}
            onClick={onClick}
          />
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
  onClick: CommentsProps['onClick'];
};

const CommentItem = ({ postId, comment, onClick }: CommentItemProps) => {
  const utils = trpc.useUtils();

  const { user, parentId, repliedCount } = comment;

  function invalidate() {
    utils.comments.getMany.invalidate({
      postId,
      parentId: parentId || undefined
    });
  }

  const like = trpc.likes.comment.like.useMutation({
    onSuccess: invalidate
  });
  const dislike = trpc.likes.comment.dislike.useMutation({
    onSuccess: invalidate
  });

  return (
    <div className={cn('py-2.5', !parentId && 'px-4')}>
      <div
        className='flex gap-3'
        onClick={() =>
          onClick({
            pid: parentId || comment.id,
            rid: comment.id
          })
        }
      >
        <UserAvatar
          imageUrl={user.image}
          name={user.name}
          className={cn('size-12', parentId && 'size-6.5')}
        />
        <div className='flex w-full flex-col'>
          <span className='text-muted-foreground text-xs'>{user.name}</span>
          <p className='line-clamp-3 py-1 text-sm'>{comment.text}</p>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-xs'>
              {formatTimeDistance(comment.createdAt)} · 江苏
            </span>
            <div className='flex items-center gap-6'>
              <button
                className='flex h-6 items-center gap-1.5'
                onClick={(e) => {
                  e.stopPropagation();
                  like.mutate({ commentId: comment.id });
                }}
              >
                <Heart
                  className={cn(
                    'size-5',
                    comment.likeStatus === 'like' && 'text-destructive fill-destructive'
                  )}
                />
                <span className='text-muted-foreground text-xs'>{comment.likeCount}</span>
              </button>
              <button
                className='size-6'
                onClick={(e) => {
                  e.stopPropagation();
                  dislike.mutate({ commentId: comment.id });
                }}
              >
                <HeartCrack
                  className={cn(
                    'size-5',
                    comment.likeStatus === 'dislike' &&
                      'text-background fill-muted-foreground -ml-0.5 size-6'
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      {!!repliedCount && (
        <Boundary fallback={<div>sub loading...</div>}>
          <SubComments
            postId={postId}
            parentId={comment.id}
            repliedCount={repliedCount}
            onClick={onClick}
          />
        </Boundary>
      )}
    </div>
  );
};

type SubCommentsProps = CommentsProps & {
  repliedCount: number;
  parentId: string;
};

const SubComments = ({ repliedCount, ...props }: SubCommentsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data, fetchNextPage } = trpc.comments.getMany.useInfiniteQuery(
    {
      limit: DEFAULT_LIMIT / 2,
      postId: props.postId,
      parentId: props.parentId
    },
    { getNextPageParam: (next) => next.nextCursor, enabled: isOpen }
  );

  const comments = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className='pl-15'>
      <div className={cn(!isOpen && 'hidden')}>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} {...props} />
        ))}
      </div>
      {!!repliedCount && (
        <OpenButton
          isOpen={isOpen}
          repliedCount={repliedCount}
          currentCount={comments.length}
          onClick={async () => {
            if (!isOpen) return setIsOpen(true);
            if (comments.length === repliedCount) return setIsOpen(false);

            await fetchNextPage();
            setIsOpen(true);
          }}
        />
      )}
    </div>
  );
};

type OpenButtonProps = {
  isOpen: boolean;
  repliedCount: number;
  currentCount: number;
  onClick: () => void;
};

const OpenButton = ({ isOpen, repliedCount, currentCount, onClick }: OpenButtonProps) => {
  const child =
    isOpen && currentCount === repliedCount ? (
      <>
        收起
        <ChevronUp className='size-4' />
      </>
    ) : (
      <>
        展开
        {currentCount === 0 || (currentCount === repliedCount && isOpen === false)
          ? ` ${repliedCount} 条回复`
          : '更多'}
        <ChevronDown className='size-3.5' />
      </>
    );

  return (
    <button
      className='text-muted-foreground relative flex items-center gap-0.5 py-1 pl-8 text-start text-xs'
      onClick={onClick}
    >
      <div className='bg-border absolute left-0 top-1/2 h-[1px] w-6 -translate-y-1/2' />
      {child}
    </button>
  );
};
