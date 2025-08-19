'use client';

import Dropzone, { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TabsSectionProps = {
  onDrop: (files: File[]) => void;
  className?: string;
};

const TabsSection = ({ onDrop, className }: TabsSectionProps) => {
  return (
    <Tabs defaultValue='video' className={cn(className)}>
      <TabsList>
        <TabsTrigger value='video'>视频投稿</TabsTrigger>
        <TabsTrigger value='audio'>音频投稿</TabsTrigger>
        <TabsTrigger value='sticker'>贴纸投稿</TabsTrigger>
      </TabsList>
      <TabsContent value='video'>
        <Dropzone multiple={false} onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className='flex cursor-pointer flex-col items-center gap-y-3 border-2 border-dashed border-gray-300 py-12'
            >
              <Upload className='text-muted-foreground size-6' />
              <p className='text-muted-foreground text-xs'>快来上传你的作品吧！</p>
              <Button className='w-32'>上传视频</Button>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      </TabsContent>
      <TabsContent value='audio'>音频投稿</TabsContent>
      <TabsContent value='sticker'>贴纸投稿</TabsContent>
    </Tabs>
  );
};

export default TabsSection;
