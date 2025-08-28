'use client';

import { AlertTriangleIcon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { cn } from '@/lib/utils';
import { PostStatus } from '@/lib/enum';
import Boundary from '@/components/boundary';

import AuthorSection from '../author-section';
import PostDescription from './post-description';

type PostSectionProps = { postId: string };

const PostSection = (props: PostSectionProps) => {
  return (
    <Boundary fallback={<p>loading...</p>}>
      <PostSectionSuspense {...props} />
    </Boundary>
  );
};

const PostSectionSuspense = ({ postId }: PostSectionProps) => {
  const utils = trpc.useUtils();

  const [post] = trpc.posts.getOne.useSuspenseQuery({ id: postId });

  const create = trpc.postViews.create.useMutation({
    onSuccess: () => {
      utils.posts.getOne.invalidate({ id: postId });
    }
  });

  const isUnready = post.status !== 'ready';

  return (
    <div>
      <div
        className={cn(
          'relative aspect-video overflow-hidden rounded-xl bg-black',
          isUnready && 'rounded-b-none'
        )}
      >
        Player
      </div>
      {isUnready && (
        <div className='flex items-center gap-2 rounded-b-xl bg-yellow-500 px-4 py-3'>
          <AlertTriangleIcon className='size-4 shrink-0 text-black' />
          <p className='line-clamp-1 text-xs font-medium text-black md:text-sm'>
            内容{PostStatus[post.status]}
          </p>
        </div>
      )}
      <div className='mt-4 flex flex-col gap-4'>
        <h1 className='text-xl font-semibold'>{post.title}</h1>
        <AuthorSection user={post.user} postId={post.id} />
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
