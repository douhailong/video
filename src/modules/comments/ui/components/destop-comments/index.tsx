import CommentForm from './comment-form';

type DestopCommentsProps = {
  postId: string;
};

const DestopComments = ({ postId }: DestopCommentsProps) => {
  return (
    <div className='hidden pb-4 sm:block'>
      <CommentForm postId={postId} />
    </div>
  );
};

export default DestopComments;
