import { HydrateClient, trpc } from '@/trpc/server';

import { DEFAULT_LIMIT } from '@/lib/constants';
import StudioView, { Channels } from '@/modules/studio/ui/views/studio-view';

type PageProps = {
  searchParams: Promise<{ channel: Channels }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { channel } = await searchParams;

  void trpc.studioPost.getMany.prefetch({ page: 1, pageSize: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <StudioView channel={channel} />
    </HydrateClient>
  );
}
