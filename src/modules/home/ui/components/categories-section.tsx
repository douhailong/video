'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRouter } from 'next/navigation';

import { trpc } from '@/trpc/client';
import CategoriesCarousel from '@/components/categories-carousel';

type CategoriesSectionProps = { categoryId?: string };

const CategoriesSection = ({ categoryId }: CategoriesSectionProps) => {
  return (
    <Suspense fallback={<CategoriesCarousel.Skeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <CategoriesSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default CategoriesSection;

const CategoriesSectionSuspense = ({ categoryId }: CategoriesSectionProps) => {
  const router = useRouter();

  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const data = categories.map((category) => ({
    label: category.name,
    value: category.id
  }));

  const onSelect = (value?: string) => {
    const url = new URL(window.location.href);

    value ? url.searchParams.set('categoryId', value) : url.searchParams.delete('categoryId');

    router.push(url.toString());
  };

  return <CategoriesCarousel value={categoryId} data={data} onSelect={onSelect} />;
};
