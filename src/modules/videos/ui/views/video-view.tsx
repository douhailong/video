import VideoSection from '../components/videos/video-section';
import SuggestionsSection from '../components/suggestions-section';
import CommentsSection from '../components/comments-section';

type VideoViewProps = {
  videoId: string;
};

const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className='mx-auto mb-10 flex max-w-[1700px] flex-col px-4 pt-2.5'>
      <div className='flex flex-col gap-4 xl:flex-row'>
        <div className='flex-1'>
          <VideoSection videoId={videoId} />
          <div className='mt-4 block xl:hidden'>
            <SuggestionsSection videoId={videoId} isManual />
          </div>
          {/* <CommentsSection videoId={videoId} /> */}
        </div>
        <div className='shrink-1 hidden xl:block xl:w-[380px] 2xl:w-[460px]'>
          <SuggestionsSection videoId={videoId} />
        </div>
      </div>
    </div>
  );
};

export default VideoView;
