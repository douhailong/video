'use client';

import { trpc } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/lib/constants';

type HistoryRendererProps = {};

const HistoryRenderer = ({}: HistoryRendererProps) => {
  const [data] = trpc.history.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (next) => next.nextCursor }
  );

  const views = data?.pages.flatMap((page) => page.items) || [];

  console.log(views, '?????');

  return (
    <div className='flex flex-col'>
      {views.map((i) => (
        <div>
          <span>{i.post.title}</span>
        </div>
      ))}
    </div>
  );
};

export default HistoryRenderer;
