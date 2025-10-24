'use client';

import Dropzone from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';

const UploadPicture = () => {
  const upload = trpc.upload.upload.useMutation();

  const onDrop = (files: File[]) => {
    console.log(files, 'gggggggggggggggggg');
  };

  return (
    <Dropzone accept={{ image: ['.jpeg', '.jpg', '.png', 'webp'] }} onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className='flex cursor-pointer flex-col items-center gap-y-3 border border-dashed border-gray-300 py-12'
        >
          <UploadCloud className='text-muted-foreground size-6' />
          <p className='text-muted-foreground text-xs'>
            点击上传 或直接将图片文件拖入此区域
          </p>
          <Button className='w-32'>上传图片</Button>
          <input {...getInputProps()} />
        </div>
      )}
    </Dropzone>
  );
};

export default UploadPicture;
