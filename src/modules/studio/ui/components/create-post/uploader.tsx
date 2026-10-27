'use client';

import { useState } from 'react';
import Dropzone from 'react-dropzone';

import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';

export default function Uploader() {
  // const [percent, setPercent] = useState(10);

  const create = trpc.posts.studio.create.useMutation();

  async function onDrop([file]: File[]) {
    const { name, size, type } = file;

    const { postId, uploadId } = await create.mutateAsync({
      type: 'video',
      title: file.name,
      file: { name, size, type }
    });

    // TODO upload file to uploadId

    await fetch(uploadId, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });
  }

  return (
    <Dropzone accept={{ video: ['.mp4', '.webm'] }} multiple={false} onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <div className='flex flex-col items-center gap-6 py-8'>
          <div
            className='size-34 flex cursor-pointer flex-col items-center justify-center rounded-full bg-stone-100 outline-none'
            {...getRootProps()}
          >
            <div className='size-0 border-x-[19px] border-b-[21px] border-x-transparent border-b-stone-600' />
            <div className='size-4 bg-stone-600' />
            <div className=' mt-2.5 h-1.5 w-10 bg-stone-600' />
          </div>
          <p className='font-medium'>将要上传的视频文件拖放到此处</p>
          <Button {...getRootProps()}>选择文件</Button>
          <input {...getInputProps()} />
          {/* <Progress percent={percent} /> */}
        </div>
      )}
    </Dropzone>
  );
}

function Progress({ percent }: { percent: number }) {
  return (
    <div className='h-1 w-1/2 overflow-hidden rounded-full bg-gray-300'>
      <div
        className='h-1 w-1/2 bg-gray-500 duration-150'
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
