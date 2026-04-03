import {
  and,
  desc,
  eq,
  getTableColumns,
  lt,
  or,
  inArray,
  isNull,
  sql,
  count,
  isNotNull
} from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { db } from '@/db';
import { comments, follows, posts, postViews, users } from '@/db/schema';
import { suspenseProcedure, procedure, createTRPCRouter } from '@/trpc/init';

export const watchRouter = createTRPCRouter({
  // getOne: suspenseProcedure
  //   .input(z.object({ postId: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const { postId } = input;

  //     const [data] = await db
  //       .select()
  //       .from(posts)
  //       .innerJoin(users, eq(users.id, posts.userId))
  //       .where(and(eq(posts.id, postId), eq(posts.visible, 'public')));

  //     if (!data) {
  //       throw new TRPCError({ code: 'NOT_FOUND' });
  //     }

  //     return data;
  //   }),

  // getMetadata: suspenseProcedure
  //   .input(
  //     z.object({
  //       postId: z.uuid()
  //     })
  //   )
  //   .query(async ({ input, ctx }) => {
  //     const { postId } = input;
  //     const { userId } = ctx;
  //   }),
  getMany: suspenseProcedure
    .input(
      z.object({
        cursor: z.object({ id: z.uuid(), updateAt: z.date() }).nullish(),
        limit: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const { userId } = ctx;

      const data = await db
        .select({
          ...getTableColumns(posts),
          user: {
            ...getTableColumns(users),
            followed: isNotNull(follows.followerId).mapWith(Boolean)
          },
          viewCount: db.$count(postViews, eq(postViews.postId, posts.id))
        })
        .from(posts)
        .innerJoin(users, eq(users.id, posts.userId))
        .leftJoin(
          follows,
          and(
            eq(follows.followedId, posts.userId),
            userId ? eq(follows.followerId, userId) : sql`false`
          )
        )
        .where(
          and(
            eq(posts.visible, 'public'),
            cursor
              ? or(
                  lt(posts.updatedAt, cursor.updateAt),
                  and(eq(posts.updatedAt, cursor.updateAt), lt(posts.id, cursor.id))
                )
              : undefined
          )
        )
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
