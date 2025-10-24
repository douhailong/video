export const dynamic = 'force-dynamic';

import { HydrateClient, trpc } from '@/trpc/server';

import SearchView from '@/modules/search/ui/views/search-view';
import { DEFAULT_LIMIT } from '@/lib/constants';

type PageProps = {
  searchParams: { query: string; categoryId?: string };
};

const Page = async ({ searchParams }: PageProps) => {
  const { categoryId, query } = await searchParams;

  // void trpc.categories.getMany.prefetch();
  // void trpc.search.getMany.prefetchInfinite({ query, categoryId, limit: DEFAULT_LIMIT * 4 });

  return 1;
  return (
    // <HydrateClient>
    {
      /* <SearchView query={query} categoryId={categoryId} /> */
    }
    // </HydrateClient>
  );
};

export default Page;
