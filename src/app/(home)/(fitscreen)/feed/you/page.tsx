import { trpc, HydrateClient } from '@/trpc/server';

import YouView from '@/modules/you/ui/views/you-view';

const Page = async () => {
  // void trpc.you.getYou.prefetch();

  return (
    // <HydrateClient>
    <YouView />
    // </HydrateClient>
  );
};

export default Page;
