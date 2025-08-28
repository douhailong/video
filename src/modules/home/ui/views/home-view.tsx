import Categories from '@/modules/categories/ui/components/categories';
import PostsSection from '../components/posts/posts-section';

type HomeViewProps = { categoryId?: string };

const HomeView = ({ categoryId }: HomeViewProps) => {
  return (
    <div className='mx-auto mb-5 flex max-w-[2400px] flex-col gap-y-6 px-4 pt-2.5'>
      <Categories categoryId={categoryId} />
      <PostsSection />
    </div>
  );
};

export default HomeView;
