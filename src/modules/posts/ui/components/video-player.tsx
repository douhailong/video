import { cn } from '@/lib/utils';

type VideoPlayerProps = {
  className?: string;
};

const VideoPlayer = ({ className }: VideoPlayerProps) => {
  return <div className={cn('aspect-video bg-amber-500', className)}>VideoPlayer</div>;
};

export default VideoPlayer;
