import {
  MoreVertical,
  ChevronDown,
  Loader2,
  ThumbsDown,
  ThumbsUp,
  MessageSquareText
} from 'lucide-react';

import { cn } from '@/lib/utils';
import Boundary from '@/components/boundary';
import UserAvatar from '@/components/user-avatar';
import { trpc } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/lib/constants';
import { ManyCommentTypes } from '@/modules/comments/types';

type CommentsProps = {
  postId: string;
  parentId?: string;
};

const Comments = (props: CommentsProps) => (
  <Boundary fallback={<CommentsSkeleton />}>
    <CommentsSuspense {...props} />
  </Boundary>
);

const CommentsSuspense = ({ postId }: CommentsProps) => {
  const [data] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
      postId
    },
    { getNextPageParam: (next) => next.nextCursor }
  );

  const comments = data?.pages.flatMap((page) => page.items) || [];

  console.log(comments, '1111');

  return (
    <div className='flex-1'>
      {comments.map((comment) => (
        <CommentItem key={comment.id} postId={postId} comment={comment} />
      ))}
    </div>
  );
};

const CommentsSkeleton = () => (
  <div className='flex h-full items-center justify-center'>
    <Loader2 className='text-muted-foreground size-6 animate-spin' />
  </div>
);

export default Comments;

type CommentItemProps = {
  postId: string;
  comment: ManyCommentTypes['items'][number];
};

const CommentItem = ({ postId, comment }: CommentItemProps) => {
  const utils = trpc.useUtils();

  const likeMutation = trpc.like.comment.like.useMutation({
    onSuccess: () => utils.comments.getMany.invalidate({ postId })
  });
  const dislikeMutation = trpc.like.comment.dislike.useMutation({
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
      <div className='flex w-full flex-col pr-1'>
        <div className='text-muted-foreground flex items-center justify-between text-xs'>
          <span>{user.name}</span>
          <span>5天前</span>
        </div>
        <p className='line-clamp-3 py-1 text-sm'>{comment.text}</p>
        <div className='flex items-center justify-between py-1'>
          <div className='flex items-center gap-3'>
            <button
              className='text-muted-foreground flex items-center gap-1.5 text-xs'
              onClick={() => likeMutation.mutate({ commentId: comment.id })}
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
              onClick={() => dislikeMutation.mutate({ commentId: comment.id })}
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
          <button>
            <MoreVertical className='text-muted-foreground size-4.5' />
          </button>
        </div>
        <SubComments postId={postId} parentId={comment.id} />
        {/* {commentId && (
          <div className='mt-1 flex flex-col gap-2'>
            <CommentItem />
            <CommentItem />
            <CommentItem />
          </div>
        )} */}
        <OpenButton />
      </div>
    </div>
  );
};

const SubComments = ({ postId, parentId }: CommentsProps) => {
  if (!parentId) {
    return null;
  }

  return (
    <div className='bg-red-200'>
      {/* <CommentItem postId={postId} commentId={'sub--commentId--1'} />
      <CommentItem postId={postId} commentId={'sub--commentId--2'} />
      <CommentItem postId={postId} commentId={'sub--commentId--3'} />
      <CommentItem postId={postId} commentId={'sub--commentId--4'} /> */}
    </div>
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
