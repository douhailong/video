'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Loader2Icon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import InfiniteScroll from '@/components/infinite-scroll';
import CommentForm from '@/modules/comments/ui/components/comment-form';
import CommentItem from '@/modules/comments/ui/components/comment-item';
import { DEFAULT_LIMIT } from '@/lib/constants';

type CommentsSectionProps = {
  videoId: string;
};

const CommentsSectionSuspense = ({ videoId }: CommentsSectionProps) => {
  return (
    <Suspense fallback={<CommentsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <CommentsSection videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default CommentsSectionSuspense;

const CommentsSection = ({ videoId }: CommentsSectionProps) => {
  const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <div className='mt-6'>
      <div className='flex flex-col gap-6'>
        <h1 className='text-lg font-bold'>{comments.pages?.[0].total} Comments</h1>
        <CommentForm videoId={videoId} />
        <div className='flex flex-col gap-4 mt-2'>
          {comments.pages
            .flatMap((page) => page.items)
            .map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          <InfiniteScroll
            isManual
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={query.fetchNextPage}
          />
        </div>
      </div>
    </div>
  );
};

const CommentsSectionSkeleton = () => {
  return (
    <div className='flex items-center justify-center mt-6'>
      <Loader2Icon className='animate-spin text-muted-foreground size-5' />
    </div>
  );
};
