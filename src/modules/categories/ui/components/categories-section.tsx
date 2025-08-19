'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRouter } from 'next/navigation';

import { trpc } from '@/trpc/client';
import CategoriesCarousel from '@/components/categories-carousel';
import Error from '@/components/error';

type CategoriesSectionProps = { categoryId?: string };

const CategoriesSection = ({ categoryId }: CategoriesSectionProps) => {
  return (
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<CategoriesCarousel.Skeleton />}>
        <CategoriesSectionSuspense categoryId={categoryId} />
      </Suspense>
    </ErrorBoundary>
  );
};

const CategoriesSectionSuspense = ({ categoryId }: CategoriesSectionProps) => {
  const router = useRouter();
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const data = categories.map((category) => ({
    label: category.name,
    value: category.id
  }));

  const onSelect = (value?: string) => {
    const url = new URL(process.env.NEXT_PUBLIC_SERVER_URL!);

    value ? url.searchParams.set('categoryId', value) : url.searchParams.delete('categoryId');
    router.push(url.toString());
  };

  return <CategoriesCarousel value={categoryId} data={data} onSelect={onSelect} />;
};

export default CategoriesSection;
