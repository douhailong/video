import { HydrateClient, trpc } from '@/trpc/server';

import VideoView from '@/modules/studio/ui/views/video-view';

type PageProps = {
  params: Promise<{ videoId: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;

  void trpc.studio.getOne.prefetch({ id: videoId });
  void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default Page;
