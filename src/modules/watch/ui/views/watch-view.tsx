'use client';

import { trpc } from '@/trpc/client';
import { MiniPlayer, FullPlayer } from '@/components/player';

import MobileComments from '@/modules/comments/ui/components/mobile-comments';

import { DesktopMetadata, MobileMetadata } from '../components/metadata';
import { DesktopRelated, MobileRelated } from '../components/related';

type WatchViewProps = {
  postId: string;
  currentTime?: number;
};

const WatchView = ({ postId }: WatchViewProps) => {
  const [data] = trpc.posts.getOne.useSuspenseQuery({ id: postId });

  console.log(data, '???????....');

  return (
    <div className='flex flex-col'>
      <FullPlayer />
      <div className='w-full sm:px-6 lg:mx-auto lg:max-w-[2314px] lg:py-6'>
        <div className='flex flex-col lg:flex-row lg:justify-center lg:gap-6'>
          <div className='w-full lg:min-w-[640px] lg:max-w-[calc((100vh-56px-24px-136px)*(16/9))]'>
            <MiniPlayer />
            <MobileMetadata postId={postId} data={data} />
            <DesktopMetadata postId={postId} data={data} />
            <div className='mx-4 mb-4 mt-2 block sm:hidden'>
              <MobileComments commentCount={data.commentCount} postId={postId} />
            </div>
            <div className='block lg:hidden'>
              <MobileRelated />
            </div>
            <div className='hidden sm:block'>desktop comments</div>
          </div>
          <div className='hidden w-full min-w-[300px] max-w-[402px] lg:block'>
            <DesktopRelated />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchView;
