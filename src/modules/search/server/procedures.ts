import { and, desc, eq, getTableColumns, ilike, lt, or } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { db } from '@/db';
import { users, videoReactions, videos, videoViews } from '@/db/schema';
import { procedure, protectedProcedure, createTRPCRouter } from '@/trpc/init';

export const searchRouter = createTRPCRouter({
  getMany: procedure
    .input(
      z.object({
        cursor: z.object({ id: z.string().uuid(), updateAt: z.date() }).nullish(),
        limit: z.number(),
        query: z.string().nullish(),
        categoryId: z.string().uuid().nullish()
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit, query, categoryId } = input;

      const data = await db
        .select({
          ...getTableColumns(videos),
          user: users,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(eq(videoReactions.videoId, videos.id), eq(videoReactions.status, 'like'))
          )
        })
        .from(videos)
        .where(
          and(
            ilike(videos.title, `%${query}%`),
            categoryId ? eq(videos.categoryId, categoryId) : undefined,
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updateAt),
                  and(eq(videos.updatedAt, cursor.updateAt), lt(videos.id, cursor.id))
                )
              : undefined
          )
        )
        .innerJoin(users, eq(videos.authorId, users.id))
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore ? { id: lastItem.id, updateAt: lastItem.updatedAt } : null;

      return { items, nextCursor };
    })
});
