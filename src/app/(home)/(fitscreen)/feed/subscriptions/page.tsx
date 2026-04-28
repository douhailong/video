import { trpc, HydrateClient } from '@/trpc/server';
import SubscriptionsView from '@/modules/subscriptions/ui/views/subscriptions-view';

export default function Page() {
  return (
    <HydrateClient>
      <SubscriptionsView />
    </HydrateClient>
  );
}
