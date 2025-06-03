import { and, desc, eq, lt, or } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { db } from '@/db';
import { videos } from '@/db/schema';
import { procedure, protectedProcedure, createTRPCRouter } from '@/trpc/init';

export const studioRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({ id: z.string().uuid(), updateAt: z.date() })
          .nullish(),
        limit: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;

      const data = await db
        .select()
        .from(videos)
        .where(
          and(
            eq(videos.authorId, userId),
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updateAt),
                  and(
                    eq(videos.updatedAt, cursor.updateAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
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
