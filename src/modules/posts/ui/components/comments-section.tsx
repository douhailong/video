'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

import { trpc } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/lib/constants';
import Boundary from '@/components/boundary';
import InfiniteScroll from '@/components/infinite-scroll';
import UserAvatar from '@/components/user-avatar';

import CommentForm from '@/modules/comments/ui/components/comment-form';
import CommentItem from '@/modules/comments/ui/components/comment-item';

type CommentsSectionProps = { postId: string };

const CommentsSectionSuspense = ({ postId }: CommentsSectionProps) => {
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const session = useSession();

  const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    {
      postId,
      limit: DEFAULT_LIMIT
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const user = session.data?.user;

  return (
    <div className='mt-6 flex flex-col gap-6'>
      <h1 className='text-lg font-bold'>{comments.pages[0].total} 条评论</h1>
      <div className='flex gap-3'>
        <UserAvatar size='lg' imageUrl={user?.image} name={user?.name} />
        <CommentForm postId={postId} />
      </div>
      <div className='mt-2 flex flex-col gap-2.5'>
        {comments.pages
          .flatMap((page) => page.items)
          .map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              feedbackId={feedbackId}
              onSuccess={() => setFeedbackId(null)}
              onOpenFeedback={(commentId) => {
                setFeedbackId(commentId === feedbackId ? null : commentId);
              }}
            />
          ))}
        <InfiniteScroll
          isManual
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
          fetchNextPage={query.fetchNextPage}
        />
      </div>
    </div>
  );
};

const CommentsSection = (props: CommentsSectionProps) => {
  return (
    <Boundary fallback={<p>loading...</p>}>
      <CommentsSectionSuspense {...props} />
    </Boundary>
  );
};

export default CommentsSection;
