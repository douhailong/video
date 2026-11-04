import Link from 'next/link';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SizeConstraint from '@/components/size-constraint';
import Boundary from '@/components/boundary';
import { VideoTable, Loading } from '../components/studio-view/video-table';

const channels = [
  { label: '视频', value: 'video' },
  { label: '直播', value: 'live' },
  { label: '播放列表', value: 'playlist' }
] as const;

export type Channels = (typeof channels)[number]['value'];

export default function StudioView({ channel }: { channel: Channels }) {
  return (
    <SizeConstraint className='sm:px-0'>
      <SizeConstraint.Title title='内容' />
      <Tabs defaultValue='video' value={channel} className='gap-0'>
        <div className='border-b px-4 sm:px-6'>
          <TabsList variant='line' className='gap-6'>
            {channels.map((item) => (
              <TabsTrigger key={item.value} value={item.value} asChild>
                <Link href={`/studio?channel=${item.value}`}>{item.label}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value='video'>
          <Boundary fallback={<Loading />}>
            <VideoTable />
          </Boundary>
        </TabsContent>
        <TabsContent value='live'>内容-直播-开发中...</TabsContent>
        <TabsContent value='playlist'>内容-播放列表-开发中...</TabsContent>
      </Tabs>
    </SizeConstraint>
  );
}
