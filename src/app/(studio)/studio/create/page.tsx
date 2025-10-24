import { HydrateClient, trpc } from '@/trpc/server';

import CreatePostView from '@/modules/studio/ui/views/create-post-view';

const Page = async () => {
  // void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <CreatePostView />
    </HydrateClient>
  );
};

export default Page;
