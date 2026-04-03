import { HydrateClient, trpc } from '@/trpc/server';

import { DEFAULT_LIMIT } from '@/lib/constants';
import SearchView from '@/modules/search/ui/views/search-view';

type PageProps = {
  searchParams: { query: string; categoryId?: string };
};

const Page = async ({ searchParams }: PageProps) => {
  const { categoryId, query } = await searchParams;

  const queryText = decodeURIComponent(query);

  // void trpc.categories.getMany.prefetch();
  void trpc.search.getMany.prefetchInfinite({
    query: queryText,
    categoryId,
    limit: DEFAULT_LIMIT
  });

  return (
    <HydrateClient>
      <SearchView
        query={queryText}
        // categoryId={categoryId}
      />
    </HydrateClient>
  );
};

export default Page;
