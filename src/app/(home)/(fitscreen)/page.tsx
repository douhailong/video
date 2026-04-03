import { trpc, HydrateClient } from '@/trpc/server';

import { DEFAULT_LIMIT } from '@/lib/constants';
import HomeView from '@/modules/home/ui/views/home-view';

const Page = async () => {
  void trpc.posts.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT * 2 });

  return (
    <HydrateClient>
      <HomeView />
    </HydrateClient>
  );
};

export default Page;
