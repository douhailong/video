import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ScreenContent from '@/components/screen-content';

import HeaderRenderer from '@/modules/user/ui/components/header-renderer';
import PlaylistModal from '@/modules/playlists/ui/components/playlist-modal';
import RichShelf from '../components/you-view/rich-shelf';

type YouViewProps = {};

const YouView = ({}: YouViewProps) => {
  return (
    <ScreenContent>
      <HeaderRenderer />
      <div className='pt-6'>
        <RichShelf title='历史记录' href='/feed/history' />
        {/* <div className='bg-red-200'>11</div> */}
        <RichShelf
          title='播放列表'
          description='2 个视频'
          href='/feed/playlists'
          actionButton={
            <PlaylistModal>
              <Button size='icon' variant='ghost'>
                <Plus />
              </Button>
            </PlaylistModal>
          }
        />
        <RichShelf title='稍后观看' description='2 个视频' href='/feed/playlists' />
        <RichShelf title='赞过的视频' description='2 个视频' href='/feed/history' />
        <RichShelf title='我的剪辑' description='2 个视频' href='/feed/history' />
      </div>
    </ScreenContent>
  );
};

export default YouView;
