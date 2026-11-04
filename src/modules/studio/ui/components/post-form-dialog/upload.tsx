'use client';

import { useState } from 'react';
import Dropzone from 'react-dropzone';

import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';

export default function Upload() {
  // const [percent, setPercent] = useState(10);

  const create = trpc.studioPost.create.useMutation();

  async function onDrop([file]: File[]) {
    const { name, size, type } = file;
  }

  return (
    <div className='flex h-full flex-col'>
      <Dropzone accept={{ video: ['.mp4'] }} multiple={false} onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div className='flex flex-1 flex-col items-center justify-center gap-6'>
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
          </div>
        )}
      </Dropzone>
      <div className='text-muted-foreground mb-6 text-xs'>
        <p className='text-center'>
          向 YouTube 提交视频，即表示你确认同意 YouTube 的服务条款和社区准则。
        </p>
        <p className='my-1.5 text-center'>
          请确保你的视频不会侵犯他人的隐私或版权。
          <span className='text-blue-600'>了解详情</span>
        </p>
      </div>
    </div>
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
