import PostSection from '../components/post/post-section';
import CommentsSection from '../components/comments-section';

type PostViewProps = {
  postId: string;
};

const PostView = ({ postId }: PostViewProps) => {
  return (
    <div className='mx-auto mb-10 flex max-w-[1700px] flex-col px-4 pt-2.5'>
      <div className='flex flex-col gap-4 xl:flex-row'>
        <div className='flex-1'>
          <PostSection postId={postId} />
          <div className='mt-4 block xl:hidden'>Suggestions</div>
          <CommentsSection postId={postId} />
        </div>
        <div className='shrink-1 hidden xl:block xl:w-[380px] 2xl:w-[460px]'>
          Suggestions
        </div>
      </div>
    </div>
  );
};

export default PostView;
