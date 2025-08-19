'use client';

import { trpc } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/lib/constants';
import VideoCard from '@/components/video/video-card';

const VideosSection = () => {
  const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT * 2 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <div className='grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2 lg:grid-cols-3'>
      {videos.pages
        .flatMap((page) => page.items)
        .map((video) => (
          <VideoCard
            key={video.id}
            id={video.id}
            username={video.user.name}
            likeCount={video.likeCount}
            viewCount={video.viewCount}
            title={video.title}
          />
        ))}
    </div>
  );
};

export default VideosSection;
