import { trpc, HydrateClient } from '@/trpc/server';

import HomeView from '@/modules/home/ui/views/home-view';

type PageProps = {
  searchParams: Promise<{ categoryId?: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { categoryId } = await searchParams;

  void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
};

export default Page;
