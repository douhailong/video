import { MonitorSpeaker } from 'lucide-react';

import { cn } from '@/lib/utils';

type VideoPlayerProps = { className?: string };

const VideoPlayer = ({ className }: VideoPlayerProps) => {
  return (
    <div className={cn('group relative', className)}>
      <div className='aspect-video w-full bg-red-400'>Player</div>
      <button
        className='absolute right-3 top-3 cursor-pointer text-white duration-300 hover:scale-110'
        title='添加到稍后观看'
      >
        <MonitorSpeaker className='size-4.5' />
      </button>
    </div>
  );
};

export default VideoPlayer;
