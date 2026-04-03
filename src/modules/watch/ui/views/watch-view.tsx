import Boundary from '@/components/boundary';
import { MiniPlayer, FullPlayer } from '@/components/player';

import {
  DesktopRelated,
  MobileRelated,
  DesktopLoading,
  MobileLoading
} from '../components/related';

import ActionBar from '../components/action-bar';
import CommentsBar from '@/modules/comments/ui/comments-bar';

type WatchViewProps = {
  postId: string;
  watchTime?: number;
};

const WatchView = ({ postId }: WatchViewProps) => {
  return (
    <div className='flex flex-col'>
      <FullPlayer />
      <div className='w-full sm:px-6 lg:mx-auto lg:max-w-[2314px] lg:py-6'>
        <div className='flex flex-col lg:flex-row lg:justify-center lg:gap-4'>
          <div className='w-full lg:min-w-[640px] lg:max-w-[calc((100vh-56px-24px-136px)*(16/9))]'>
            <MiniPlayer />
            <ActionBar postId={postId} />
            <CommentsBar postId={postId} />
            <div className='block lg:hidden'>
              <Boundary fallback={<MobileLoading />}>
                <MobileRelated />
              </Boundary>
            </div>
          </div>
          <div className='hidden w-full min-w-[300px] max-w-[402px] lg:block'>
            <Boundary fallback={<DesktopLoading />}>
              <DesktopRelated />
            </Boundary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchView;
