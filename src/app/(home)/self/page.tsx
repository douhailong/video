import { trpc, HydrateClient } from '@/trpc/server';

import SelfView from '@/modules/users/ui/views/self-view';

type PageProps = {
  searchParams: Promise<{ tab?: string; subTab?: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { tab, subTab } = await searchParams;

  return (
    <HydrateClient>
      <SelfView tab={tab} subTab={subTab} />
    </HydrateClient>
  );
};

export default Page;
