import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SizeConstraint from '@/components/size-constraint';
import Boundary from '@/components/boundary';

import { PostsTable, Loading } from '../components/posts-table';
import { PlaylistsTable } from '../components/playlists-table';

const channels = [
  { label: '视频', value: 'video' },
  { label: '图文', value: 'picture' },
  { label: '直播', value: 'live' },
  { label: '播放列表', value: 'playlist' }
] as const;

export type Channels = (typeof channels)[number]['value'];

export default function OverviewView({ channel }: { channel: Channels }) {
  return (
    <SizeConstraint className='w-full sm:px-0'>
      <div className='px-6'>
        <SizeConstraint.Title size='md' title='频道内容' />
      </div>
      <Tabs defaultValue='video' value={channel} className='gap-0'>
        <div className='border-b px-6'>
          <TabsList variant='line' className='gap-6'>
            {channels.map((item) => (
              <TabsTrigger key={item.value} value={item.value} asChild>
                <Link href={`/studio/overview?channel=${item.value}`}>{item.label}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value='video'>
          <Boundary fallback={<Loading />}>
            <PostsTable />
          </Boundary>
        </TabsContent>
        <TabsContent value='picture'>picture</TabsContent>
        <TabsContent value='live'>live</TabsContent>
        <TabsContent value='playlist'>
          <PlaylistsTable />
        </TabsContent>
      </Tabs>
    </SizeConstraint>
  );
}
