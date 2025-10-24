import { HydrateClient, trpc } from '@/trpc/server';
import WorkView from '@/modules/studio/ui/views/work-view';

type PageProps = {
  params: Promise<{ workId: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { workId } = await params;

  void trpc.studio.works.getOne.prefetch({ id: workId });
  void trpc.categories.getMany();

  return (
    <HydrateClient>
      <WorkView workId={workId} />
    </HydrateClient>
  );
};

export default Page;
