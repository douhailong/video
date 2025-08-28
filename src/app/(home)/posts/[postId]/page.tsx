import { HydrateClient, trpc } from '@/trpc/server';

import { DEFAULT_LIMIT } from '@/lib/constants';
import PostView from '@/modules/posts/ui/views/post-view';

type PageProps = {
  params: Promise<{ postId: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { postId } = await params;

  void trpc.posts.getOne.prefetch({ id: postId });
  void trpc.comments.getMany.prefetchInfinite({ postId, limit: DEFAULT_LIMIT });
  void trpc.suggestions.getMany.prefetchInfinite({ postId, limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <PostView postId={postId} />
    </HydrateClient>
  );
};

export default Page;
