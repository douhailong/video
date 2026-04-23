import { DEFAULT_LIMIT, type MediaType } from '@/lib/constants';
import PublishPostView from '@/modules/studio-post/ui/views/publish-post-view';
import { trpc } from '@/trpc/server';

type PageProps = {
  searchParams: Promise<{ mediaType: MediaType }>;
  params: Promise<{ id: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { mediaType } = await searchParams;

  void trpc.studioPost.getOne.prefetch({ id });
  void trpc.playlists.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });

  return <PublishPostView mediaType={mediaType} postId={id} />;
}
