import SizeConstraint from '@/components/size-constraint';
import VideoUploader from '../components/create-post-view/video-uploader';

const videoSpec = [
  { title: '视频格式', desc: '推荐jpg、jpeg、png、webp格式，不支持gif格式' },
  { title: '视频大小', desc: '视频文件大小不超过50MB' },
  { title: '视频比例', desc: '推荐视频宽高比例：3:4、4:3，不建议超过 1:2' }
];

export default function CreatePostView() {
  return <div>上传视频</div>;
  return (
    <SizeConstraint size='md'>
      <SizeConstraint.Title size='md' title='上传视频' />
      <div className='mb-3 flex gap-3 divide-x py-3'>
        {videoSpec.map((spec) => (
          <div className='flex-1' key={spec.title}>
            <span className='text-sm font-medium'>{spec.title}</span>
            <p className='text-muted-foreground text-xs'>{spec.desc}</p>
          </div>
        ))}
      </div>
      <VideoUploader />
    </SizeConstraint>
  );
}
