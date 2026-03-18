'use client';

import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import UploadVideo from '../components/create-post-view/upload-video';
import UploadPicture from '../components/create-post-view/upload-picture';
import UploadHint from '../components/create-post-view/upload-hint';

const CreatePostView = () => {
  const [currentTab, setCurrentTab] = useState<'video' | 'picture'>('picture');

  return (
    <div className='max-w-screen-lg px-6 pt-4'>
      <Tabs
        defaultValue={currentTab}
        onValueChange={(val) => setCurrentTab(val as typeof currentTab)}
      >
        <TabsList variant='line'>
          <TabsTrigger value='video'>发布视频</TabsTrigger>
          <TabsTrigger value='picture'>发布图文</TabsTrigger>
        </TabsList>
        {/* <UploadHint /> */}
        <FileAdvice />
        <TabsContent value='video'>
          <UploadVideo />
        </TabsContent>
        <TabsContent value='picture'>
          <UploadPicture />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatePostView;

const FileAdvice = () => {
  return (
    <div className='flex gap-3 py-3'>
      <div className='flex-1'>
        <span className='text-sm font-medium'>图片格式</span>
        <p className='text-muted-foreground text-xs'>
          推荐jpg、jpeg、png、webp格式，不支持gif格式
        </p>
      </div>
      <div className='border-l' />
      <div className='flex-1'>
        <span className='text-sm font-medium'>图片大小</span>
        <p className='text-muted-foreground text-xs'>图片文件大小不超过50MB</p>
      </div>
      <div className='border-l' />
      <div className='flex-1'>
        <span className='text-sm font-medium'>比例</span>
        <p className='text-muted-foreground text-xs'>
          推荐图片宽高比例：3:4、4:3，不建议超过 1:2
        </p>
      </div>
    </div>
  );
};
