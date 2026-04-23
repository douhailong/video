import CommentForm from './comment-form';

type DestopCommentsProps = {};

const DestopComments = ({}: DestopCommentsProps) => {
  return (
    <div className='hidden sm:block'>
      <CommentForm />
    </div>
  );
};

export default DestopComments;
