import type { Metadata } from 'next';

import { trpc, HydrateClient } from '@/trpc/server';
import SubscriptionsView from '@/modules/subscriptions/ui/views/subscriptions-view';

const Page = () => {
  return (
    <HydrateClient>
      <SubscriptionsView />
    </HydrateClient>
  );
};

export default Page;

export const metadata: Metadata = { title: '订阅-YouTube clone' };
