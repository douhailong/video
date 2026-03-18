import {
  and,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  lt,
  or,
  sql
} from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import { minio } from '@/lib/minio';
import { users, posts, postViews, postLikes } from '@/db/schema';
import {
  publicProcedure,
  procedure,
  createTRPCRouter,
  suspenseProcedure
} from '@/trpc/init';
import { postSchema } from '@/lib/zod';

export const postsRouter = createTRPCRouter({
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
  getOne: suspenseProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const { userId } = ctx;

      const [post] = await db
        .select({
          ...getTableColumns(posts),
          user: users,
          viewCount: db.$count(postViews, eq(postViews.postId, posts.id)),
          likeCount: db.$count(
            postLikes,
            and(eq(postLikes.postId, posts.id), eq(postLikes.status, 'like'))
          ),
          likeStatus: postLikes.status
        })
        .from(posts)
        .innerJoin(users, eq(users.id, posts.userId))
        .leftJoin(
          postLikes,
          and(
            eq(postLikes.postId, posts.id),
            userId ? eq(postLikes.userId, userId) : sql`false`
          )
        )
        .where(eq(posts.id, id));
      // .groupBy(posts.id, users.id, postLikes.status);

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return post;
    }),
  // ???????????????????????????
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

      const viewerLikes = db.$with('viewer_reaction').as(
        db
          .select()
          .from(postLikes)
          .where(userId ? eq(postLikes.userId, userId) : sql`false`)
      );

      const data = await db
        .with(viewerLikes)
        .select({
          ...getTableColumns(posts),
          user: { id: users.id, name: users.name, image: users.image },
          reaction: viewerLikes.status,
          views: db.$count(postViews, eq(postViews.postId, posts.id)),
          likes: db.$count(
            postLikes,
            and(eq(postLikes.postId, posts.id), eq(postLikes.status, 'like'))
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
        .innerJoin(users, eq(users.id, posts.userId))
        .leftJoin(viewerLikes, eq(viewerLikes.postId, posts.id))
        .orderBy(desc(posts.updatedAt), desc(posts.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.id, updateAt: lastItem.updatedAt }
        : null;

      return { items, nextCursor };
    })
});
