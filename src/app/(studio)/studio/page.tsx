import { HydrateClient, trpc } from '@/trpc/server';

import StudioView from '@/modules/studio/ui/views/studio-view';

import { DEFAULT_LIMIT } from '@/lib/constants';

type PageProps = {};

const Page = async ({}: PageProps) => {
  void trpc.studio.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
};

export default Page;
