import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SizeConstraint from '@/components/size-constraint';

import { MediaType } from '@/lib/constants';
import VideoUploader from '../components/upload-media-view/video-uploader';
import PictureUploader from '../components/upload-media-view/picture-uploader';

export default function UploadMediaView() {
  return (
    <SizeConstraint size='md'>
      <Tabs defaultValue='video'>
        <TabsList variant='line' className='gap-6'>
          <TabsTrigger value='video'>发布视频</TabsTrigger>
          <TabsTrigger value='picture'>发布图文</TabsTrigger>
        </TabsList>
        <TabsContent value='video'>
          <MediaSpec mediaType='video' />
          <VideoUploader />
        </TabsContent>
        <TabsContent value='picture'>
          <MediaSpec mediaType='picture' />
          <PictureUploader />
        </TabsContent>
      </Tabs>
    </SizeConstraint>
  );
}

const videoSpec = [
  { title: '视频格式', desc: '推荐jpg、jpeg、png、webp格式，不支持gif格式' },
  { title: '视频大小', desc: '视频文件大小不超过50MB' },
  { title: '视频比例', desc: '推荐视频宽高比例：3:4、4:3，不建议超过 1:2' }
];

const pictureSpec = [
  { title: '图片格式', desc: '推荐jpg、jpeg、png、webp格式，不支持gif格式' },
  { title: '图片大小', desc: '图片文件大小不超过50MB' },
  { title: '图片比例', desc: '推荐图片宽高比例：3:4、4:3，不建议超过 1:2' }
];

const MediaSpec = ({ mediaType }: { mediaType: MediaType }) => {
  const mediaSpec = mediaType === 'video' ? videoSpec : pictureSpec;

  return (
    <div className='mb-3 flex gap-3 divide-x py-2.5'>
      {mediaSpec.map((spec) => (
        <div className='flex-1'>
          <span className='text-sm font-medium'>{spec.title}</span>
          <p className='text-muted-foreground text-xs'>{spec.desc}</p>
        </div>
      ))}
    </div>
  );
};
