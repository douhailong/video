import type { Metadata } from 'next';

import { trpc, HydrateClient } from '@/trpc/server';
import YouView from '@/modules/you/ui/views/you-view';

const Page = () => {
  return (
    <HydrateClient>
      <YouView />
    </HydrateClient>
  );
};

export default Page;

export const metadata: Metadata = { title: 'YouTube clone' };
