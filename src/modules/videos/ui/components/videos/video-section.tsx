'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangleIcon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { cn } from '@/lib/utils';
import { VideoStatus } from '@/lib/enum';
import Error from '@/components/error';

import VideoPlayer from './video-player';
import VideoOwner from './video-owner';
import VideoReactions from './video-reactions';
import VideoMenu from './video-menu';
import VideoDescription from './video-description';

type VideoSectionProps = { videoId: string };

const VideoSection = ({ videoId }: VideoSectionProps) => {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<Error />}>
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSectionSuspense = ({ videoId }: VideoSectionProps) => {
  const utils = trpc.useUtils();

  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });
  const create = trpc.videoViews.create.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    }
  });

  const isUnready = video.status !== 'ready';

  const onPlay = () => {
    create.mutate({ videoId });
  };

  return (
    <div>
      <div
        className={cn(
          'relative aspect-video overflow-hidden rounded-xl bg-black',
          isUnready && 'rounded-b-none'
        )}
      ></div>
      {isUnready && (
        <div className='flex items-center gap-2 rounded-b-xl bg-yellow-500 px-4 py-3'>
          <AlertTriangleIcon className='size-4 shrink-0 text-black' />
          <p className='line-clamp-1 text-xs font-medium text-black md:text-sm'>
            视频正在{VideoStatus[video.status]}
          </p>
        </div>
      )}
      <div className='mt-4 flex flex-col gap-4'>
        <h1 className='text-xl font-semibold'>{video.title}</h1>
        <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center'>
          <VideoOwner user={video.user} videoId={video.id} />
          <div className='flex gap-x-2'>
            <VideoReactions
              videoId={video.id}
              likes={video.likeCount}
              dislikes={video.dislikeCount}
              viewerReaction={video.viewerReaction}
            />
            <VideoMenu variant='secondary' videoId={video.id} />
          </div>
        </div>
        <VideoDescription
          viewCount={video.viewCount}
          createdAt={video.createdAt}
          description={video.description}
        />
      </div>
    </div>
  );
};

const VideoSectionSkeleton = () => {
  return (
    <>
      {/* <VideoPlayer.Skeleton /> */}
      {/* <VideoTopRow.Skeleton /> */}
    </>
  );
};

export default VideoSection;

// const VideoTopRowSkeleton = () => {
//   return (
//     <div className='mt-4 flex flex-col gap-4'>
//       <div className='flex flex-col gap-2'>
//         <Skeleton className='h-6 w-4/5 md:w-2/5' />
//       </div>
//       <div className='flex w-full items-center justify-between'>
//         <div className='flex w-[70%] items-center gap-3'>
//           <Skeleton className='h-10 w-10 shrink-0 rounded-full' />
//           <div className='flex w-full flex-col gap-2'>
//             <Skeleton className='md:2/6 h-5 w-4/5' />
//             <Skeleton className='md:1/5 h-5 w-3/5' />
//           </div>
//         </div>
//         <Skeleton className='md:1/6 h-9 w-2/6 rounded-full' />
//       </div>
//       <Skeleton className='h-[120px] w-full' />
//     </div>
//   );
// };
