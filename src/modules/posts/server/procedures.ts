import { and, desc, eq, getTableColumns, inArray, isNotNull, lt, or } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import { minio } from '@/lib/minio';
import { users, posts, postViews, postLikes, subscribes } from '@/db/schema';
import {
  publicProcedure,
  procedure,
  createTRPCRouter,
  suspenseProcedure
} from '@/trpc/init';
import { postSchema } from '@/lib/zod';

export const postsRouter = createTRPCRouter({
  getMany: procedure
    .input(
      z.object({
        cursor: z.object({ id: z.uuid(), updateAt: z.date() }).nullish(),
        limit: z.number()
      })
    )
    .query(async () => {
      await new Promise((res) => {
        setTimeout(() => {
          res(1);
        }, 2000);
      });

      return { nextCursor: { id: '', updateAt: new Date() } };
    })
  // create: procedure.input(postSchema).mutation(async ({ ctx, input }) => {
  //   const { userId } = ctx;
  //   const [createdPost] = await db
  //     .insert(posts)
  //     .values({
  //       userId: userId,
  //       ...input
  //     })
  //     .returning();
  //   if (!createdPost) {
  //     throw new TRPCError({ code: 'BAD_REQUEST' });
  //   }
  //   return createdPost;
  // }),
  // remove: procedure.input(z.object({ id: z.uuid() })).mutation(async ({ ctx, input }) => {
  //   const { id } = input;
  //   const { userId } = ctx;
  //   const [removedPost] = await db
  //     .delete(posts)
  //     .where(and(eq(posts.id, id), eq(posts.userId, userId)))
  //     .returning();
  //   if (!removedPost) {
  //     throw new TRPCError({ code: 'NOT_FOUND' });
  //   }
  //   return removedPost;
  // }),
  // update: procedure.input(postSchema).mutation(async ({ ctx, input }) => {
  //   const { id, ...restInput } = input;
  //   const { userId } = ctx;
  //   const [updatedPost] = await db
  //     .update(posts)
  //     .set({
  //       ...restInput,
  //       updatedAt: new Date()
  //     })
  //     .where(and(eq(posts.id, id!), eq(posts.userId, userId)))
  //     .returning();
  //   if (!updatedPost) {
  //     throw new TRPCError({ code: 'NOT_FOUND' });
  //   }
  //   return updatedPost;
  // }),
  // getOne: suspenseProcedure
  //   .input(z.object({ id: z.uuid() }))
  //   .query(async ({ ctx, input }) => {
  //     const { userId } = ctx;
  //     const { id } = input;
  //     const viewerReactions = db.$with('viewer_reaction').as(
  //       db
  //         .select({ postId: postLikes.postId, status: postLikes.status })
  //         .from(postLikes)
  //         .where(inArray(postLikes.userId, userId ? [userId] : []))
  //     );
  //     const viewersubscribes = db.$with('viewer_follow').as(
  //       db
  //         .select()
  //         .from(subscribes)
  //         .where(inArray(subscribes.followerId, userId ? [userId] : []))
  //     );
  //     const [post] = await db
  //       .with(viewerReactions, viewersubscribes)
  //       .select({
  //         ...getTableColumns(posts),
  //         user: {
  //           ...getTableColumns(users),
  //           subscribes: db.$count(subscribes, eq(subscribes.followerId, users.id)),
  //           followed: isNotNull(viewersubscribes.followerId).mapWith(Boolean)
  //         },
  //         views: db.$count(postViews, eq(postViews.postId, posts.id)),
  //         likes: db.$count(
  //           postLikes,
  //           and(eq(postLikes.postId, posts.id), eq(postLikes.status, 'like'))
  //         ),
  //         dislikes: db.$count(
  //           postLikes,
  //           and(eq(postLikes.postId, posts.id), eq(postLikes.status, 'dislike'))
  //         ),
  //         reaction: viewerReactions.status
  //       })
  //       .from(posts)
  //       .innerJoin(users, eq(users.id, posts.userId))
  //       .leftJoin(viewerReactions, eq(viewerReactions.postId, posts.id))
  //       .leftJoin(viewersubscribes, eq(viewersubscribes.followerId, users.id))
  //       .where(eq(posts.id, id));
  //     // .groupBy(posts.id, users.id, postLikes.status);
  //     if (!post) {
  //       throw new TRPCError({ code: 'NOT_FOUND' });
  //     }
  //     return post;
  //   }),
  // getMany: suspenseProcedure
  //   .input(
  //     z.object({
  //       cursor: z.object({ id: z.uuid(), updateAt: z.date() }).nullish(),
  //       limit: z.number()
  //     })
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const { userId } = ctx;
  //     const { cursor, limit } = input;
  //     const viewerReactions = db.$with('viewer_reaction').as(
  //       db
  //         .select()
  //         .from(postLikes)
  //         .where(inArray(postLikes.userId, userId ? [userId] : []))
  //     );
  //     const data = await db
  //       .with(viewerReactions)
  //       .select({
  //         ...getTableColumns(posts),
  //         user: { id: users.id, name: users.name, image: users.image },
  //         reaction: viewerReactions.status,
  //         views: db.$count(postViews, eq(postViews.postId, posts.id)),
  //         likes: db.$count(
  //           postLikes,
  //           and(eq(postLikes.postId, posts.id), eq(postLikes.status, 'like'))
  //         )
  //       })
  //       .from(posts)
  //       .where(
  //         and(
  //           cursor
  //             ? or(
  //                 lt(posts.updatedAt, cursor.updateAt),
  //                 and(eq(posts.updatedAt, cursor.updateAt), lt(posts.id, cursor.id))
  //               )
  //             : undefined
  //         )
  //       )
  //       .innerJoin(users, eq(users.id, posts.userId))
  //       .leftJoin(viewerReactions, eq(viewerReactions.postId, posts.id))
  //       .orderBy(desc(posts.updatedAt), desc(posts.id))
  //       .limit(limit + 1);
  //     const hasMore = data.length > limit;
  //     const items = hasMore ? data.slice(0, -1) : data;
  //     const lastItem = items[items.length - 1];
  //     const nextCursor = hasMore
  //       ? { id: lastItem.id, updateAt: lastItem.updatedAt }
  //       : null;
  //     // await new Promise((res) => {
  //     //   setTimeout(() => {
  //     //     res(1);
  //     //   }, 2000);
  //     // });
  //     return { items, nextCursor };
  //   })
});
