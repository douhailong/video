import Boundary from '@/components/boundary';
import { FullPlayer } from '@/components/player';

import {
  DesktopRecommend,
  MobileRecommend,
  DesktopLoading,
  MobileLoading
} from '../components/recommend';

import ActionBar from '../components/action-bar';
import Comments from '@/modules/comments/ui/comments';

type WatchViewProps = {
  postId: string;
  watchTime?: number;
};

export default function WatchView({ postId, watchTime }: WatchViewProps) {
  return (
    <div className='flex flex-col'>
      <div className='block max-h-[calc(100vh-169px)] lg:hidden'>
        <FullPlayer />
      </div>
      <div className='w-full sm:px-6 lg:mx-auto lg:max-w-[2314px] lg:py-6'>
        <div className='flex flex-col lg:flex-row lg:justify-center lg:gap-4'>
          <div className='w-full lg:min-w-[640px] lg:max-w-[calc((100vh-56px-24px-136px)*(16/9))]'>
            <div className='hidden aspect-video rounded-lg lg:block'>
              <FullPlayer />
            </div>
            <ActionBar postId={postId} />
            <Comments postId={postId} />
            <div className='block lg:hidden'>
              <Boundary fallback={<MobileLoading />}>
                <MobileRecommend />
              </Boundary>
            </div>
          </div>
          <div className='hidden w-full min-w-[300px] max-w-[402px] lg:block'>
            <Boundary fallback={<DesktopLoading />}>
              <DesktopRecommend />
            </Boundary>
          </div>
        </div>
      </div>
    </div>
  );
}
