import { trpc, HydrateClient } from '@/trpc/server';

import WatchView from '@/modules/watch/ui/views/watch-view';

type PageProps = {
  searchParams: { v: string; t?: string };
};

const Page = async ({ searchParams }: PageProps) => {
  const { v, t } = await searchParams;

  return (
    <HydrateClient>
      <WatchView watchId={v} watchTime={t} />
    </HydrateClient>
  );
};

export default Page;
