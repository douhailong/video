import PostListCard from '@/modules/posts/ui/components/post-list-card';

type SubscriptionsViewProps = {};

const SubscriptionsView = ({}: SubscriptionsViewProps) => {
  return (
    <div className='mx-auto max-w-[1284px]'>
      <div className='flex flex-col'>
        <PostListCard />
        <PostListCard />
        <PostListCard />
        <PostListCard />
        <PostListCard />
      </div>
    </div>
  );
};

export default SubscriptionsView;
