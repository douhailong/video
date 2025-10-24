'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { trpc } from '@/trpc/client';
import Boundary from '@/components/boundary';
import CategoriesCarousel from '@/components/categories-carousel';

const Categories = () => {
  return (
    <Boundary fallback={<CategoriesCarousel.Skeleton />}>
      <CategoriesSuspense />
    </Boundary>
  );
};

const CategoriesSuspense = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const options = categories.map((category) => ({
    label: category.name,
    value: category.id
  }));
  const categoryId = searchParams.get('categoryId');

  const onSelect = (value?: string) => {
    const url = new URL(process.env.NEXT_PUBLIC_SERVER_URL!);

    if (value) {
      url.searchParams.set('categoryId', value);
    } else {
      url.searchParams.delete('categoryId');
    }

    router.push(url.toString());
  };

  return <CategoriesCarousel value={categoryId} options={options} onSelect={onSelect} />;
};

export default Categories;
