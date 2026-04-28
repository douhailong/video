import DestopComments from './components/destop-comments';
import MobileComments from './components/mobile-comments';

type CommentsProps = {
  postId: string;
};

export default function Comments({ postId }: CommentsProps) {
  return (
    <>
      <MobileComments postId={postId} />
      <DestopComments postId={postId} />
    </>
  );
}
