import { HydrateClient, trpc } from '@/trpc/server';
import { DEFAULT_LIMIT } from '@/lib/constants';

import WatchView from '@/modules/watch/ui/views/watch-view';

type PageProps = {
  searchParams: Promise<{ v: string; t: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { v, t } = await searchParams;

  void trpc.posts.getOne.prefetch({ id: v });
  void trpc.comments.getMany.prefetchInfinite({ postId: v, limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <WatchView postId={v} />
    </HydrateClient>
  );
};

export default Page;
