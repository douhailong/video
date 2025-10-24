'use client';

import { useSession } from 'next-auth/react';
import { AlertTriangleIcon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { cn } from '@/lib/utils';
import { PostStatus } from '@/lib/enum';
import Boundary from '@/components/boundary';
import VideoPlayer from '@/components/video/video-player';

import PostAuthor from './post-author';
import PostReaction from './post-reaction';
import PostDescription from './post-description';
import PostMenu from './post-menu';

type PostSectionProps = { postId: string };

const PostSection = (props: PostSectionProps) => {
  return (
    <Boundary fallback={<p>loading...</p>}>
      <PostSectionSuspense {...props} />
    </Boundary>
  );
};

const PostSectionSuspense = ({ postId }: PostSectionProps) => {
  const session = useSession();
  const utils = trpc.useUtils();

  const [post] = trpc.posts.getOne.useSuspenseQuery({ id: postId });

  const create = trpc.postViews.create.useMutation({
    onSuccess: () => {
      utils.posts.getOne.invalidate({ id: postId });
    }
  });

  const self = session.data?.user;
  const isSelf = self?.id === post.user.id;
  const isUnready = post.status !== 'ready';

  return (
    <div>
      <div
        className={cn(
          'relative aspect-video overflow-hidden rounded-xl bg-black',
          isUnready && 'rounded-b-none'
        )}
      >
        <VideoPlayer
          playbackUrl={post.playbackUrl}
          type='complete'
          onPlay={() => create.mutate({ postId })}
        />
      </div>
      <PostBanner hidden={!isUnready} text={`内容${PostStatus[post.status]}`} />
      <div className='mt-4 flex flex-col gap-4'>
        <h1 className='text-xl font-semibold'>{post.title}</h1>
        <div className='flex items-center justify-between'>
          <PostAuthor
            isSelf={isSelf}
            postId={post.id}
            user={post.user}
            onSuccess={() => utils.posts.getOne.invalidate({ id: postId })}
          />
          <div className='flex gap-3'>
            <PostReaction
              postId={postId}
              likes={post.likes}
              dislikes={post.dislikes}
              reaction={post.reaction}
            />
            <PostMenu isSelf={isSelf} />
          </div>
        </div>
        <PostDescription
          views={post.views}
          createdAt={post.createdAt}
          description={post.description}
        />
      </div>
    </div>
  );
};

export default PostSection;

type PostBannerProps = {
  text: string;
  hidden: boolean;
};

const PostBanner = ({ text, hidden }: PostBannerProps) => {
  if (hidden) return null;

  return (
    <div className='flex items-center gap-2 rounded-b-xl bg-yellow-500 px-4 py-3'>
      <AlertTriangleIcon className='size-4 shrink-0 text-black' />
      <p className='line-clamp-1 text-xs font-medium text-black md:text-sm'>{text}</p>
    </div>
  );
};
