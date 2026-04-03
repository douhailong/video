'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/lib/constants';
import { RowCard, type Actions } from '@/components/card';
import InfiniteScroll from '@/components/infinite-scroll';

const HistoryBody = () => {
  const utils = trpc.useUtils();

  const [data, query] = trpc.history.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (next) => next.nextCursor }
  );

  const { mutate } = trpc.history.deleteOne.useMutation({
    onSuccess() {
      utils.history.getMany.invalidate();
    }
  });

  const views = data?.pages.flatMap((page) => page.items) || [];

  const actions: Actions = [
    {
      icon: Trash2,
      text: '从观看记录中移除',
      onClick: (id) => mutate({ id })
    }
  ];

  return (
    <div className='flex-1'>
      <div className='flex flex-col gap-4'>
        {views.map(({ post, user }) => (
          <Link key={post.id} href={`/watch?v=${post.id}`}>
            <RowCard
              user={user}
              data={{
                id: post.id,
                title: post.title,
                duration: 1008,
                thumbUrl: post.thumbUrl,
                playbackUrl: '',
                viewCount: post.viewCount,
                createdAt: post.createdAt
              }}
              actions={actions}
            />
          </Link>
        ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};

const Loading = () => (
  <div className='flex flex-1 flex-col gap-4'>
    {Array.from({ length: 10 }).map((_, i) => (
      <RowCard.Loading key={i} />
    ))}
  </div>
);

export { HistoryBody, Loading };
