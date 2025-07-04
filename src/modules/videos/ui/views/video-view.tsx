import VideoSection from '../components/video-section';
import SuggestionsSection from '../components/suggestions-section';
import CommentsSection from '../components/comments-section';

type VideoViewProps = {
  videoId: string;
};

const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className='flex flex-col max-w-[1700px] mx-auto pt-2.5 px-4 mb-10'>
      <div className='flex flex-col xl:flex-row gap-4'>
        <div className='flex-1'>
          <VideoSection videoId={videoId} />
          <div className='xl:hidden block mt-4'>
            <SuggestionsSection videoId={videoId} isManual />
          </div>
          <CommentsSection videoId={videoId} />
        </div>
        <div className='hidden xl:block xl:w-[380px] 2xl:w-[460px] shrink-1'>
          <SuggestionsSection videoId={videoId} />
        </div>
      </div>
    </div>
  );
};

export default VideoView;
