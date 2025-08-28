import { and, desc, eq, getTableColumns, inArray, isNotNull, lt, or } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import { minio } from '@/lib/minio';
import { users, posts, postViews, postReactions, follows } from '@/db/schema';
import {
  procedure,
  protectedProcedure,
  createTRPCRouter,
  suspenseProcedure
} from '@/trpc/init';
import { postSchema } from '@/lib/zod';

export const postsRouter = createTRPCRouter({
  // restoreThumbnail: protectedProcedure
  //   .input(z.object({ id: z.string().uuid() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const { userId } = ctx;

  //     if (!input.id) {
  //       throw new TRPCError({ code: 'BAD_REQUEST' });
  //     }

  //     const [existingpost] = await db
  //       .select()
  //       .from(posts)
  //       .where(and(eq(posts.id, input.id), eq(posts.authorId, userId)));

  //     if (!existingpost) {
  //       throw new TRPCError({ code: 'NOT_FOUND' });
  //     }

  //     if (!existingpost.muxPlaybackId) {
  //       throw new TRPCError({ code: 'BAD_REQUEST' });
  //     }

  //     if (existingpost.thumbnailKey) {
  //       const utApi = new UTApi();

  //       await utApi.deleteFiles(existingpost.thumbnailKey);
  //       await db
  //         .update(posts)
  //         .set({ thumbnailKey: null, thumbnailUrl: null })
  //         .where(and(eq(posts.id, input.id), eq(posts.authorId, userId)));
  //     }

  //     const tempThumbnailUrl = `https://image.mux.com/${existingpost.muxPlaybackId}/thumbnail.jpg`;

  //     const utApi = new UTApi();
  //     const uploadThumbnail = await utApi.uploadFilesFromUrl(tempThumbnailUrl);

  //     if (!uploadThumbnail.data) {
  //       throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
  //     }

  //     const { key: thumbnailKey, ufsUrl: thumbnailUrl } = uploadThumbnail.data;

  //     const [updatedPost] = await db
  //       .update(posts)
  //       .set({ thumbnailUrl, thumbnailKey })
  //       .where(and(eq(posts.id, input.id), eq(posts.authorId, userId)))
  //       .returning();

  //     return updatedPost;
  //   }),

  create: protectedProcedure
    .input(postSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const [createdPost] = await db
        .insert(posts)
        .values({
          authorId: userId,
          ...input
        })
        .returning();

      if (!createdPost) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      return createdPost;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const { userId } = ctx;

      const [removedPost] = await db
        .delete(posts)
        .where(and(eq(posts.id, id), eq(posts.authorId, userId)))
        .returning();

      if (!removedPost) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return removedPost;
    }),
  update: protectedProcedure.input(postSchema).mutation(async ({ ctx, input }) => {
    const { id, ...restInput } = input;
    const { userId } = ctx;

    const [updatedPost] = await db
      .update(posts)
      .set({
        ...restInput,
        updatedAt: new Date()
      })
      .where(and(eq(posts.id, id!), eq(posts.authorId, userId)))
      .returning();

    if (!updatedPost) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return updatedPost;
  }),
  getOne: suspenseProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { id } = input;

      const viewerReactions = db.$with('viewer_reaction').as(
        db
          .select({ postId: postReactions.postId, status: postReactions.status })
          .from(postReactions)
          .where(inArray(postReactions.reactorId, userId ? [userId] : []))
      );

      const viewerFollows = db.$with('viewer_follow').as(
        db
          .select()
          .from(follows)
          .where(inArray(follows.followerId, userId ? [userId] : []))
      );

      const [post] = await db
        .with(viewerReactions, viewerFollows)
        .select({
          ...getTableColumns(posts),
          user: {
            ...getTableColumns(users),
            follows: db.$count(follows, eq(follows.followerId, users.id)),
            followed: isNotNull(viewerFollows.followerId).mapWith(Boolean)
          },
          views: db.$count(postViews, eq(postViews.postId, posts.id)),
          likes: db.$count(
            postReactions,
            and(eq(postReactions.postId, posts.id), eq(postReactions.status, 'like'))
          ),
          dislikes: db.$count(
            postReactions,
            and(eq(postReactions.postId, posts.id), eq(postReactions.status, 'dislike'))
          ),
          reaction: viewerReactions.status
        })
        .from(posts)
        .innerJoin(users, eq(users.id, posts.authorId))
        .leftJoin(viewerReactions, eq(viewerReactions.postId, posts.id))
        .leftJoin(viewerFollows, eq(viewerFollows.followerId, users.id))
        .where(eq(posts.id, id));
      // .groupBy(posts.id, users.id, postReactions.status);

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return post;
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
          .select()
          .from(postReactions)
          .where(inArray(postReactions.reactorId, userId ? [userId] : []))
      );

      const data = await db
        .with(viewerReactions)
        .select({
          ...getTableColumns(posts),
          user: { id: users.id, name: users.name, image: users.image },
          reaction: viewerReactions.status,
          views: db.$count(postViews, eq(postViews.postId, posts.id)),
          likes: db.$count(
            postReactions,
            and(eq(postReactions.postId, posts.id), eq(postReactions.status, 'like'))
          )
        })
        .from(posts)
        .where(
          and(
            cursor
              ? or(
                  lt(posts.updatedAt, cursor.updateAt),
                  and(eq(posts.updatedAt, cursor.updateAt), lt(posts.id, cursor.id))
                )
              : undefined
          )
        )
        .innerJoin(users, eq(users.id, posts.authorId))
        .leftJoin(viewerReactions, eq(viewerReactions.postId, posts.id))
        .orderBy(desc(posts.updatedAt), desc(posts.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.id, updateAt: lastItem.updatedAt }
        : null;

      // await new Promise((res) => {
      //   setTimeout(() => {
      //     res(1);
      //   }, 2000);
      // });

      return { items, nextCursor };
    })
});
