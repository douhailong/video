import { HydrateClient, trpc } from '@/trpc/server';
import WorksView from '@/modules/studio/ui/views/works-view';

import { DEFAULT_LIMIT } from '@/lib/constants';

const Page = async () => {
  void trpc.studio.works.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <WorksView />
    </HydrateClient>
  );
};

export default Page;
