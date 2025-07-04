import FormSection from '../components/form-section';

type VideoViewProps = { videoId: string };

const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className='px-4 pt-2.5 max-w-screen-lg'>
      <FormSection videoId={videoId} />
    </div>
  );
};

export default VideoView;
