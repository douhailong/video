import DestopComments from './components/destop-comments';
import MobileComments from './components/mobile-comments';

type CommentsBarProps = {
  postId: string;
};

const CommentsBar = ({ postId }: CommentsBarProps) => {
  return (
    <>
      <MobileComments postId={postId} />
      <DestopComments />
    </>
  );
};

export default CommentsBar;
