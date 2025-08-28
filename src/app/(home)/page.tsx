import { trpc, HydrateClient } from '@/trpc/server';

import HomeView from '@/modules/home/ui/views/home-view';
import { DEFAULT_LIMIT } from '@/lib/constants';

type PageProps = {
  searchParams: Promise<{ categoryId?: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { categoryId } = await searchParams;

  void trpc.categories.getMany.prefetch();
  void trpc.posts.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
};

export default Page;
