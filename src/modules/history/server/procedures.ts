import { and, desc, eq, getTableColumns, lt, or, inArray, ne } from 'drizzle-orm';
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

      const [view] = await db
        .select()
        .from(postViews)
        .where(and(eq(postViews.postId, postId), eq(postViews.userId, userId)));

      if (view) {
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
      const { cursor, limit } = input;
      const { userId } = ctx;

      const data = await db
        .select({
          ...getTableColumns(postViews),
          user: users,
          post: {
            ...getTableColumns(posts),
            viewCount: db.$count(postViews, eq(postViews.postId, posts.id))
          }
        })
        .from(postViews)
        .innerJoin(
          posts,
          and(eq(postViews.postId, posts.id), eq(posts.visible, 'public'))
        )
        .innerJoin(users, eq(posts.userId, users.id))
        .where(
          and(
            eq(postViews.userId, userId),
            // ne(postViews.deleted, true),
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

  delete: procedure.input(z.object({ id: z.uuid() })).mutation(async ({ ctx, input }) => {
    const { id } = input;
    const { userId } = ctx;

    const [view] = await db
      .update(postViews)
      // .set({ deleted: true })
      .set({})
      .where(and(eq(postViews.postId, id), eq(postViews.userId, userId)))
      .returning();

    if (!view) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return view;
  }),

  deleteMany: procedure
    .input(z.object({ ids: z.array(z.uuid()) }))
    .mutation(async ({ ctx, input }) => {
      const { ids } = input;
      const { userId } = ctx;

      const views = await db
        .update(postViews)
        .set({})
        // .set({ deleted: true })
        .where(and(inArray(postViews.postId, ids), eq(postViews.userId, userId)))
        .returning();

      if (!views.length) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return views;
    })
});
