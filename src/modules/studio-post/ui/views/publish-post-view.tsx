import { type MediaType } from '@/lib/constants';
import PicturePost from '../components/publish-post-view/picture-post';
import VideoPost from '../components/publish-post-view/video-post';

type PublishPostViewProps = { mediaType: MediaType; postId: string };

export default function PublishPostView({ mediaType, postId }: PublishPostViewProps) {
  if (mediaType === 'video') {
    return <VideoPost postId={postId} />;
  }

  if (mediaType === 'picture') {
    return <PicturePost />;
  }

  return <p className='font-medium'>暂时不支持此类型作品</p>;
}
