import { db } from '@/db';
import { mux } from '@/lib/mux';
import { videos } from '@/db/schema';
import { procedure, protectedProcedure, createTRPCRouter } from '@/trpc/init';
import { TRPCError } from '@trpc/server';

export const videosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policies: ['public']
        // mp4_support: 'standard'
      },
      cors_origin: '*'
    });

    const [video] = await db
      .insert(videos)
      .values({ authorId: userId, title: 'Untitled', muxStatus: 'waiting', muxUploadId: upload.id })
      .returning();

    return { video, url: upload.url };
  })
});
