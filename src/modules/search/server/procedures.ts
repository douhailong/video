import { and, desc, eq, getTableColumns, ilike, lt, or } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { users, posts, postViews } from '@/db/schema';
import { publicProcedure, createTRPCRouter } from '@/trpc/init';

export const searchRouter = createTRPCRouter({
  getMany: publicProcedure
    .input(
      z.object({
        cursor: z.object({ id: z.uuid(), updateAt: z.date() }).nullish(),
        limit: z.number(),
        query: z.string().nullish(),
        categoryId: z.uuid().nullish()
      })
    )
    .query(async ({ input }) => {
      const { cursor, limit, query, categoryId } = input;

      const data = await db
        .select({
          ...getTableColumns(posts),
          user: users,
          viewCount: db.$count(postViews, eq(postViews.postId, posts.id))
        })
        .from(posts)
        .where(
          and(
            ilike(posts.title, `%${query}%`),
            // categoryId ? eq(posts.categoryId, categoryId) : undefined,
            eq(posts.visibility, 'public'),
            cursor
              ? or(
                  lt(posts.updatedAt, cursor.updateAt),
                  and(eq(posts.updatedAt, cursor.updateAt), lt(posts.id, cursor.id))
                )
              : undefined
          )
        )
        .innerJoin(users, eq(posts.userId, users.id))
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
