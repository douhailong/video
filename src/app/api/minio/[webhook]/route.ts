import { db } from '@/db';
import { minio } from '@/lib/minio';
import { WEBSITE_ASSETS_BUCKET } from '@/lib/constants';
import { videos } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const body = await req.json();

  const objectKey: string = body.Key;

  const videoId = objectKey.split('/')[3];

  // ??? sourceid没有吧？videoid可以拼出来
  const [updatedVideo] = await db
    .update(videos)
    .set({ sourceId: objectKey })
    .where(eq(videos.id, videoId))
    .returning();

  if (!updatedVideo) {
    return new Response('NOT_FOUND', { status: 404 });
  }

  // const stat = await minio.statObject(
  //   WEBSITE_ASSETS_BUCKET,
  //   'raw/video/3902779a-718e-4f4e-b280-76b98a4e5536/source/init.mp4'
  // );

  return Response.json({ success: true });
}
