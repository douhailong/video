'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useCreatePost } from '@/store/dialog/use-create-post';
import Uploader from './uploader';

export function CreatePostDialog() {
  const [isUploaded, setIsUploaded] = useState(false);
  const { isOpen, close } = useCreatePost();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) close();
      }}
    >
      <DialogContent
        className='rounded-3xl sm:max-w-4xl'
        title='上传视频'
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className=''>上传视频</DialogTitle>
        <div className='h-12 bg-amber-200'>contnet</div>
        <DialogFooter className='border-t'>
          <Button>继续</Button>
        </DialogFooter>
        {/* <DialogFooter className='-mx-6 border-t bg-red-50 pt-6'>111</DialogFooter> */}
        {/* <DialogTitle className=''>上传视频</DialogTitle>
        <div className='-mx-6 border-t bg-red-100 px-6 pt-6'>
          <Uploader />
          <p className='mt-12 text-center text-xs font-medium'>
            向 YouTube 提交视频，即表示你确认同意 YouTube 的服务条款和社区准则。
          </p>
          <p className='my-1.5 text-center text-xs font-medium'>
            请确保你的视频不会侵犯他人的隐私或版权。
            <Link href='' className='text-blue-600'>
              了解详情
            </Link>
          </p>
        </div> */}
      </DialogContent>
    </Dialog>
  );
}
