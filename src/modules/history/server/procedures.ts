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
  count
} from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { db } from '@/db';
import { users, postViews, posts } from '@/db/schema';
import { procedure, createTRPCRouter } from '@/trpc/init';

export const historyRouter = createTRPCRouter({
  create: procedure
    .input(
      z.object({
        postId: z.uuid(),
        watchTime: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, watchTime } = input;
      const { userId } = ctx;

      const [existingView] = await db
        .select()
        .from(postViews)
        .where(and(eq(postViews.postId, postId), eq(postViews.userId, userId)));

      if (existingView) {
        const [updatedView] = await db
          .update(postViews)
          .set({ watchTime })
          .where(and(eq(postViews.postId, postId), eq(postViews.userId, userId)))
          .returning();

        if (!updatedView) {
          throw new TRPCError({ code: 'BAD_REQUEST' });
        }

        return updatedView;
      }

      const [createdView] = await db
        .insert(postViews)
        .values({ postId, userId, watchTime })
        .returning();

      if (!createdView) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      return createdView;
    }),

  getMany: procedure
    .input(
      z.object({
        cursor: z.object({ id: z.uuid(), updateAt: z.date() }).nullish(),
        limit: z.number()
      })
    )
    .query(async ({ input, ctx }) => {
      const { userId } = ctx;
      const { cursor, limit } = input;

      const data = await db
        .select({
          ...getTableColumns(postViews),
          user: users,
          post: posts,
          viewCount: db.$count(postViews, eq(postViews.userId, userId))
        })
        .from(postViews)
        .innerJoin(users, eq(postViews.userId, users.id))
        .innerJoin(posts, eq(postViews.postId, posts.id))
        .where(
          cursor
            ? or(
                lt(postViews.updatedAt, cursor.updateAt),
                and(
                  eq(postViews.updatedAt, cursor.updateAt),
                  lt(postViews.postId, cursor.id)
                )
              )
            : undefined
        )
        .orderBy(desc(postViews.updatedAt), desc(postViews.postId))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.postId, updateAt: lastItem.updatedAt }
        : null;

      return { items, nextCursor };
    }),

  deleteMany: procedure
    .input(z.object({ ids: z.array(z.uuid()) }))
    .mutation(async ({ ctx, input }) => {
      const { ids } = input;
      const { userId } = ctx;

      const deletedViews = await db
        .delete(postViews)
        .where(and(inArray(postViews.postId, ids), eq(postViews.userId, userId)))
        .returning();

      if (!deletedViews.length) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return deletedViews;
    })
});
