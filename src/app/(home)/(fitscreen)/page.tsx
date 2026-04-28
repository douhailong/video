import { trpc, HydrateClient } from '@/trpc/server';

import { DEFAULT_LIMIT } from '@/lib/constants';
import HomeView from '@/modules/home/ui/views/home-view';

export default async function Page() {
  void trpc.posts.home.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT * 2 });

  return (
    <HydrateClient>
      <HomeView />
    </HydrateClient>
  );
}
