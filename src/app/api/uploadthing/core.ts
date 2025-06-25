import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { UploadThingError, UTApi } from 'uploadthing/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

import { db } from '@/db';
import { users, videos } from '@/db/schema';

const f = createUploadthing();

export const ourFileRouter = {
  thumbnailUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1
    }
  })
    .input(z.object({ videoId: z.string().uuid() }))
    .middleware(async ({ input }) => {
      const { userId: clerkUserId } = await auth();

      if (!clerkUserId) {
        throw new UploadThingError('UNAUTHORIZED');
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkUserId));

      if (!user) {
        throw new UploadThingError('UNAUTHORIZED');
      }

      const [video] = await db
        .select({ thumbnailKey: videos.thumbnailKey })
        .from(videos)
        .where(and(eq(videos.id, input.videoId), eq(videos.authorId, user.id)));

      if (!video) {
        throw new UploadThingError('NOT_FOUND');
      }

      if (video.thumbnailKey) {
        const utApi = new UTApi();

        await utApi.deleteFiles(video.thumbnailKey);
        await db
          .update(videos)
          .set({ thumbnailKey: null, thumbnailUrl: null })
          .where(
            and(eq(videos.id, input.videoId), eq(videos.authorId, user.id))
          );
      }

      return { user, ...input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const [video] = await db
        .update(videos)
        .set({
          thumbnailUrl: file.ufsUrl,
          thumbnailKey: file.key
        })
        .where(
          and(
            eq(videos.id, metadata.videoId),
            eq(videos.authorId, metadata.user.id)
          )
        )
        .returning();

      if (!video) {
        throw new UploadThingError('NOT_FOUND');
      }
      return { uploadedBy: metadata.user.id };
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
