import { and, eq, getTableColumns, inArray, isNotNull } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { UTApi } from 'uploadthing/server';

import { db } from '@/db';
import {
  users,
  videos,
  videoUpdateSchema,
  videoViews,
  videoReactions,
  subscriptions
} from '@/db/schema';
import { procedure, protectedProcedure, createTRPCRouter } from '@/trpc/init';
import { mux } from '@/lib/mux';

export const videosRouter = createTRPCRouter({
  restoreThumbnail: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      if (!input.id) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, input.id), eq(videos.authorId, userId)));

      if (!existingVideo) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (!existingVideo.muxPlaybackId) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      if (existingVideo.thumbnailKey) {
        const utApi = new UTApi();

        await utApi.deleteFiles(existingVideo.thumbnailKey);
        await db
          .update(videos)
          .set({ thumbnailKey: null, thumbnailUrl: null })
          .where(and(eq(videos.id, input.id), eq(videos.authorId, userId)));
      }

      const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;

      const utApi = new UTApi();
      const uploadThumbnail = await utApi.uploadFilesFromUrl(tempThumbnailUrl);

      if (!uploadThumbnail.data) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }

      const { key: thumbnailKey, ufsUrl: thumbnailUrl } = uploadThumbnail.data;

      const [updatedVideo] = await db
        .update(videos)
        .set({ thumbnailUrl, thumbnailKey })
        .where(and(eq(videos.id, input.id), eq(videos.authorId, userId)))
        .returning();

      return updatedVideo;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      if (!input.id) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      const [removedVideo] = await db
        .delete(videos)
        .where(and(eq(videos.id, input.id), eq(videos.authorId, userId)))
        .returning();

      if (!removedVideo) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return removedVideo;
    }),
  update: protectedProcedure.input(videoUpdateSchema).mutation(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;

    if (!input.id) {
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }

    const [updatedVideo] = await db
      .update(videos)
      .set({
        title: input.title,
        description: input.description,
        categoryId: input.categoryId,
        visibility: input.visibility,
        updatedAt: new Date()
      })
      .where(and(eq(videos.id, input.id), eq(videos.authorId, userId)))
      .returning();

    if (!updatedVideo) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return updatedVideo;
  }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policies: ['public'],
        inputs: [{ generated_subtitles: [{ language_code: 'en', name: 'English' }] }]
        // mp4_support: 'standard'
      },
      cors_origin: '*'
    });

    const [video] = await db
      .insert(videos)
      .values({
        authorId: userId,
        title: 'Untitled',
        muxStatus: 'waiting',
        muxUploadId: upload.id
      })
      .returning();

    return { video, url: upload.url };
  }),
  getOne: procedure.input(z.object({ id: z.string().uuid() })).query(async ({ ctx, input }) => {
    const { id } = input;
    const { clerkUserId } = ctx;

    const [user] = await db
      .select()
      .from(users)
      .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

    const userId = user ? user.id : undefined;

    const viewerReactions = db.$with('viewer_reactions').as(
      db
        .select({ videoId: videoReactions.videoId, status: videoReactions.status })
        .from(videoReactions)
        .where(inArray(videoReactions.authorId, userId ? [userId] : []))
    );

    const viewerSubscriptions = db.$with('viewer_subscriptions').as(
      db
        .select()
        .from(subscriptions)
        .where(inArray(subscriptions.subscriberId, userId ? [userId] : []))
    );

    const [video] = await db
      .with(viewerReactions, viewerSubscriptions)
      .select({
        ...getTableColumns(videos),
        user: {
          ...getTableColumns(users),
          subscriberCount: db.$count(subscriptions, eq(subscriptions.publisherId, users.id)),
          viewerSubscribed: isNotNull(viewerSubscriptions.subscriberId).mapWith(Boolean)
        },
        viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
        likeCount: db.$count(
          videoReactions,
          and(eq(videoReactions.videoId, videos.id), eq(videoReactions.status, 'like'))
        ),
        dislikeCount: db.$count(
          videoReactions,
          and(eq(videoReactions.videoId, videos.id), eq(videoReactions.status, 'dislike'))
        ),
        viewerReactions: viewerReactions.status
      })
      .from(videos)
      .innerJoin(users, eq(users.id, videos.authorId))
      .leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
      .leftJoin(viewerSubscriptions, eq(viewerSubscriptions.publisherId, users.id))
      .where(eq(videos.id, id));
    // .groupBy(videos.id, users.id, videoReactions.status);

    if (!video) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return video;
  })
});
