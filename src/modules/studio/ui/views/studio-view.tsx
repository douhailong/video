import PostsSection from '../components/posts-section';

const StudioView = () => {
  return (
    <div className='flex flex-col gap-y-5 pt-2.5'>
      <div className='px-4'>
        <h1 className='text-xl font-bold'>作品管理</h1>
      </div>
      <PostsSection />
    </div>
  );
};

export default StudioView;
