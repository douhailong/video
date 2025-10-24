import { useRef, useEffect } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

type VideoPlayerProps = {
  playbackUrl: string | null;
  autoPlay?: boolean;
  onPlay?: () => void;
  className?: string;
  type: 'simple' | 'complete';
};

const VideoPlayer = ({
  className,
  playbackUrl,
  autoPlay,
  onPlay,
  type
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Player>(null);

  videojs.options;

  useEffect(() => {
    if (!playerRef.current) {
      playerRef.current = videojs(videoRef.current!, {
        controls: true,
        preload: 'auto',
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        sources: [
          {
            src: './1080p.mp4',
            type: 'video/mp4'
          }
        ]
      });
    } else {
      // 你可以在这里更新播放器（当options改变时）
    }
  }, []);

  return (
    <div className='absolute bottom-0 left-0 right-0 top-0'>
      <div data-vjs-player>
        <video ref={videoRef} className='video-js vjs-big-play-centered'>
          <source src='./1080p.mp4' />
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer;

// return (
//   <div className={cn('group relative', className)}>
//     <div className='aspect-video w-full bg-red-400'>Player</div>
//     <button
//       className='absolute right-3 top-3 cursor-pointer text-white duration-300 hover:scale-110'
//       title='添加到稍后观看'
//     >
//       <MonitorSpeaker className='size-4.5' />
//     </button>
//   </div>
// );
