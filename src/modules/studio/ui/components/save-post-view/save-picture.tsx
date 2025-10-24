'use client';

import { PostSchema } from '@/lib/zod';

type SavePictureProps = {
  postId?: string;
};

const SavePicture = ({ postId }: SavePictureProps) => {
  return <div>SavePicture{postId}</div>;
};

export default SavePicture;
