import { and, desc, eq, getTableColumns, inArray, isNotNull, lt, or } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import { minio } from '@/lib/minio';
import { users, videos, videoViews, videoReactions, subscriptions } from '@/db/schema';
import { procedure, protectedProcedure, createTRPCRouter, suspenseProcedure } from '@/trpc/init';
import { videoSchema } from '@/lib/zod';

export const videosRouter = createTRPCRouter({
  // restoreThumbnail: protectedProcedure
  //   .input(z.object({ id: z.string().uuid() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const { userId } = ctx;

  //     if (!input.id) {
  //       throw new TRPCError({ code: 'BAD_REQUEST' });
  //     }

  //     const [existingVideo] = await db
  //       .select()
  //       .from(videos)
  //       .where(and(eq(videos.id, input.id), eq(videos.authorId, userId)));

  //     if (!existingVideo) {
  //       throw new TRPCError({ code: 'NOT_FOUND' });
  //     }

  //     if (!existingVideo.muxPlaybackId) {
  //       throw new TRPCError({ code: 'BAD_REQUEST' });
  //     }

  //     if (existingVideo.thumbnailKey) {
  //       const utApi = new UTApi();

  //       await utApi.deleteFiles(existingVideo.thumbnailKey);
  //       await db
  //         .update(videos)
  //         .set({ thumbnailKey: null, thumbnailUrl: null })
  //         .where(and(eq(videos.id, input.id), eq(videos.authorId, userId)));
  //     }

  //     const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;

  //     const utApi = new UTApi();
  //     const uploadThumbnail = await utApi.uploadFilesFromUrl(tempThumbnailUrl);

  //     if (!uploadThumbnail.data) {
  //       throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
  //     }

  //     const { key: thumbnailKey, ufsUrl: thumbnailUrl } = uploadThumbnail.data;

  //     const [updatedVideo] = await db
  //       .update(videos)
  //       .set({ thumbnailUrl, thumbnailKey })
  //       .where(and(eq(videos.id, input.id), eq(videos.authorId, userId)))
  //       .returning();

  //     return updatedVideo;
  //   }),

  create: protectedProcedure
    .input(videoSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const [createdVideo] = await db
        .insert(videos)
        .values({
          authorId: userId,
          ...input
        })
        .returning();

      if (!createdVideo) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      return createdVideo;
    }),
  update: protectedProcedure.input(videoSchema).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { id, ...restInput } = input;

    const [updatedVideo] = await db
      .update(videos)
      .set({
        ...restInput,
        updatedAt: new Date()
      })
      .where(and(eq(videos.id, id!), eq(videos.authorId, userId)))
      .returning();

    if (!updatedVideo) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return updatedVideo;
  }),
  remove: protectedProcedure.input(z.object({ id: z.uuid() })).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { id } = input;

    const [removedVideo] = await db
      .delete(videos)
      .where(and(eq(videos.id, id), eq(videos.authorId, userId)))
      .returning();

    if (!removedVideo) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return removedVideo;
  }),
  getOne: suspenseProcedure.input(z.object({ id: z.uuid() })).query(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { id } = input;

    const viewerReactions = db.$with('viewer_reaction').as(
      db
        .select({ videoId: videoReactions.videoId, status: videoReactions.status })
        .from(videoReactions)
        .where(inArray(videoReactions.viewerId, userId ? [userId] : []))
    );

    const viewerSubscriptions = db.$with('viewer_subscription').as(
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
        viewerReaction: viewerReactions.status
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
  }),
  getMany: suspenseProcedure
    .input(
      z.object({
        cursor: z.object({ id: z.uuid(), updateAt: z.date() }).nullish(),
        limit: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { cursor, limit } = input;

      const viewerReactions = db.$with('viewer_reaction').as(
        db
          .select({ videoId: videoReactions.videoId, status: videoReactions.status })
          .from(videoReactions)
          .where(inArray(videoReactions.viewerId, userId ? [userId] : []))
      );

      const data = await db
        .with(viewerReactions)
        .select({
          ...getTableColumns(videos),
          user: { id: users.id, name: users.name, image: users.image },
          viewerReaction: viewerReactions.status,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(eq(videoReactions.videoId, videos.id), eq(videoReactions.status, 'like'))
          )
        })
        .from(videos)
        .where(
          and(
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updateAt),
                  and(eq(videos.updatedAt, cursor.updateAt), lt(videos.id, cursor.id))
                )
              : undefined
          )
        )
        .innerJoin(users, eq(users.id, videos.authorId))
        .leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore ? { id: lastItem.id, updateAt: lastItem.updatedAt } : null;

      return { items, nextCursor };
    })
});
