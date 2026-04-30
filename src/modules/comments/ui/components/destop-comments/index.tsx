'use client';

import CommentForm from './comment-form';
import Comments from './comments';

type DestopCommentsProps = {
  postId: string;
};

const DestopComments = ({ postId }: DestopCommentsProps) => {
  return (
    <div className='hidden sm:block'>
      <h1 className='mb-6 text-xl font-bold'>100 条评论</h1>
      <div className='mb-8'>
        <CommentForm postId={postId} />
      </div>
      <Comments postId={postId} />
    </div>
  );
};

export default DestopComments;
