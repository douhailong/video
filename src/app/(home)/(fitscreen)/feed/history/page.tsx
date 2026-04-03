import { trpc, HydrateClient } from '@/trpc/server';
import { DEFAULT_LIMIT } from '@/lib/constants';

import HistoryView from '@/modules/history/ui/views/history-view';

const Page = async () => {
  void trpc.history.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <HistoryView />
    </HydrateClient>
  );
};

export default Page;
