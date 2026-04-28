import { HydrateClient, trpc } from '@/trpc/server';

import { DEFAULT_LIMIT } from '@/lib/constants';
import OverviewView, { Channels } from '@/modules/overview/ui/views/overview-view';

type PageProps = {
  searchParams: Promise<{ channel: Channels }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { channel } = await searchParams;

  void trpc.posts.studio.getMany.prefetch({ page: 1, pageSize: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <OverviewView channel={channel} />
    </HydrateClient>
  );
}
