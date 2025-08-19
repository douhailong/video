import { HydrateClient, trpc } from '@/trpc/server';

import CreateView from '@/modules/studio/ui/views/create-view';

const Page = async () => {
  void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <CreateView />
    </HydrateClient>
  );
};

export default Page;
