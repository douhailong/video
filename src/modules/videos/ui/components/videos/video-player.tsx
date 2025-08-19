'use client';

import MuxPlayer from '@mux/mux-player-react';

type VideoPlayerProps = {
  playbackId: string | null;
  thumbnailUrl: string | null;
  autoPlay?: boolean;
  onPlay?: () => void;
};

const VideoPlayer = ({ playbackId, thumbnailUrl, autoPlay, onPlay }: VideoPlayerProps) => {
  if (!playbackId) return null;

  return (
    <MuxPlayer
      playbackId={playbackId}
      poster={thumbnailUrl || '/placeholder.svg'}
      playerInitTime={0}
      thumbnailTime={0}
      autoPlay={autoPlay}
      className='w-full h-full object-contain'
      accentColor='#ff2056'
      onPlay={onPlay}
    />
  );
};

const VideoPlayerSkeleton = () => {
  return <div className='aspect-video bg-black rounded-xl' />;
};

VideoPlayer.Skeleton = VideoPlayerSkeleton;

export default VideoPlayer;
