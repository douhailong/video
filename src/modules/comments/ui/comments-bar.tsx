import MobileComments from './components/mobile-comments';

type CommentsBarProps = {
  postId: string;
};

const CommentsBar = ({ postId }: CommentsBarProps) => {
  return (
    <>
      <MobileComments postId={postId} />
      <div className='hidden sm:block'>desktop comments</div>
    </>
  );
};

export default CommentsBar;
