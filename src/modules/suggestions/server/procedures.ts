import { and, desc, eq, getTableColumns, lt, not, or } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { db } from '@/db';
import { users, postReactions, posts, postViews } from '@/db/schema';
import { publicProcedure, procedure, createTRPCRouter } from '@/trpc/init';

export const suggestionsRouter = createTRPCRouter({
  getMany: publicProcedure
    .input(
      z.object({
        postId: z.uuid(),
        cursor: z.object({ id: z.uuid(), updateAt: z.date() }).nullish(),
        limit: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit, postId } = input;

      const [exitingVideo] = await db.select().from(posts).where(eq(posts.id, postId));

      if (!exitingVideo) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const data = await db
        .select({
          ...getTableColumns(posts),
          user: users,
          viewCount: db.$count(postViews, eq(postViews.postId, posts.id)),
          likeCount: db.$count(
            postReactions,
            and(eq(postReactions.postId, posts.id), eq(postReactions.status, 'like'))
          )
        })
        .from(posts)
        .where(
          and(
            not(eq(posts.id, exitingVideo.id)),
            eq(posts.visible, 'public'),
            exitingVideo.categoryId
              ? eq(posts.categoryId, exitingVideo.categoryId)
              : undefined,
            cursor
              ? or(
                  lt(posts.updatedAt, cursor.updateAt),
                  and(eq(posts.updatedAt, cursor.updateAt), lt(posts.id, cursor.id))
                )
              : undefined
          )
        )
        .innerJoin(users, eq(posts.authorId, users.id))
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
