import { HydrateClient, trpc } from '@/trpc/server';
import { DEFAULT_LIMIT } from '@/lib/constants';

import WatchView from '@/modules/watch/ui/views/watch-view';

type PageProps = {
  searchParams: Promise<{ v: string; t: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { v, t } = await searchParams;

  const watchTime = t ? Number(t) : 0;

  void trpc.history.create({ postId: v, watchTime });
  void trpc.posts.home.getOne.prefetch({ id: v });
  void trpc.posts.recommend.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });
  void trpc.comments.getMany.prefetchInfinite({ postId: v, limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <WatchView postId={v} watchTime={watchTime} />
    </HydrateClient>
  );
}
