'use client';

import { useRouter } from 'next/navigation';

import { trpc } from '@/trpc/client';
import Boundary from '@/components/boundary';
import CategoriesCarousel from '@/components/categories-carousel';

type CategoriesProps = { categoryId?: string };

const Categories = (props: CategoriesProps) => {
  return (
    <Boundary fallback={<CategoriesCarousel.Skeleton />}>
      <CategoriesSuspense {...props} />
    </Boundary>
  );
};

const CategoriesSuspense = ({ categoryId }: CategoriesProps) => {
  const router = useRouter();

  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const options = categories.map((category) => ({
    label: category.name,
    value: category.id
  }));

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
