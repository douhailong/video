import { trpc, HydrateClient } from '@/trpc/server';

import PlaylistView from '@/modules/playlists/ui/views/playlist-view';

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  void trpc.playlists.getOne.prefetch({ id });

  return (
    <HydrateClient>
      <PlaylistView id={id} />
    </HydrateClient>
  );
};

export default Page;
