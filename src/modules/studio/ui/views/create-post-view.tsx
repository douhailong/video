import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import UploadVideo from '../components/create-post-view/upload-video';
import UploadPicture from '../components/create-post-view/upload-picture';
import PostHint from '../components/create-post-view/post-hint';

const CreatePostView = () => {
  return (
    <div className='max-w-screen-lg px-4 pb-4 pt-2.5'>
      <Tabs defaultValue='video'>
        <TabsList>
          <TabsTrigger value='video'>发布视频</TabsTrigger>
          <TabsTrigger value='picture'>发布图文</TabsTrigger>
        </TabsList>
        <PostHint />
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
