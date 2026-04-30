import Boundary from '@/components/boundary';
import { FullPlayer } from '@/components/player';

import {
  DesktopRecommend,
  MobileRecommend,
  DesktopLoading,
  MobileLoading
} from '../components/recommend';

import Comments from '@/modules/comments/ui/comments';
import ActionBar from '../components/action-bar';

type WatchViewProps = {
  postId: string;
  watchTime?: number;
};

export default function WatchView({ postId, watchTime }: WatchViewProps) {
  return (
    <div className='flex flex-col'>
      <div className='block h-[56vw] max-h-[calc(100vh-169px)] min-h-60 bg-black lg:hidden' />
      <div className='w-full lg:mx-auto lg:max-w-[2314px] lg:px-4 lg:py-3 2xl:px-6'>
        <div className='flex flex-col lg:flex-row lg:justify-center lg:gap-4'>
          <div className='w-full lg:min-w-[640px]'>
            <div className='hidden aspect-video rounded-lg bg-black/50 lg:block' />
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
