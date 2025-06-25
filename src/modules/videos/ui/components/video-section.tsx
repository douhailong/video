'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useAuth } from '@clerk/nextjs';

import { trpc } from '@/trpc/client';
import { cn } from '@/lib/utils';

import VideoPlayer from './video-player';
import VideoBanner from './video-banner';
import VideoTopRow from './video-top-row';

type VideoSectionProps = { videoId: string };

const VideoSectionSuspense = ({ videoId }: VideoSectionProps) => {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideoSection videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default VideoSectionSuspense;

const VideoSection = ({ videoId }: VideoSectionProps) => {
  const { isSignedIn } = useAuth();

  const utils = trpc.useUtils();
  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });
  const create = trpc.videoViews.create.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    }
  });

  const onPlay = () => {
    if (!isSignedIn) return;

    create.mutate({ videoId });
  };

  return (
    <>
      <div
        className={cn(
          'aspect-video bg-black rounded-xl overflow-hidden relative',
          video.muxStatus !== 'ready' && 'rounded-b-none'
        )}
      >
        <VideoPlayer
          // autoPlay
          onPlay={onPlay}
          thumbnailUrl={video.thumbnailUrl}
          playbackId={video.muxPlaybackId}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video} />
    </>
  );
};

const VideoSectionSkeleton = () => {
  return (
    <>
      <VideoPlayer.Skeleton />
      <VideoTopRow.Skeleton />
    </>
  );
};
