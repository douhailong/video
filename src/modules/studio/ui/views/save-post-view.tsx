'use client';

import { useParams } from 'next/navigation';

import { PostSchema } from '@/lib/zod';
import SavePicture from '../components/save-post-view/save-picture';
import SaveVideo from '../components/save-post-view/save-video';

const SavePostView = () => {
  const {
    slug: [type, postId]
  } = useParams<{ slug: [PostSchema['type'], string] }>();

  if (type === 'video') {
    return (
      <div className='max-w-screen-lg px-4 pb-8 pt-2.5'>
        <SaveVideo postId={postId} />
      </div>
    );
  }

  if (type === 'picture') {
    return (
      <div className='max-w-screen-lg px-4 pb-8 pt-2.5'>
        <SavePicture postId={postId} />
      </div>
    );
  }

  return <p className='font-medium'>暂时不支持此类型作品</p>;
};

export default SavePostView;
