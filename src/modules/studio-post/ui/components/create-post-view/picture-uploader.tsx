'use client';

import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Trash2, UploadCloud } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const PictureUploader = () => {
  const onDrop = async (files: File[]) => {
    const file = files[0];
  };

  return (
    <div className='flex h-full flex-col justify-between'>
      <div>
        <Dropzone accept={{ image: ['.jpeg', '.jpg', '.png', 'webp'] }} onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className='flex cursor-pointer flex-col items-center gap-3 border border-dashed border-gray-300 py-12'
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
      </div>
    </div>
  );
};

export default PictureUploader;
