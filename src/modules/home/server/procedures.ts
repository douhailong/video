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
import { posts, postViews, users } from '@/db/schema';
import { publicProcedure, createTRPCRouter } from '@/trpc/init';

export const commentsRouter = createTRPCRouter({
  getMany: publicProcedure
    .input(
      z.object({
        cursor: z
          .object({
            updatedAt: z.date(),
            id: z.uuid()
          })
          .nullish(),
        limit: z.number()
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit } = input;

      const viewerFeedback = db.$with('viewer_feedback').as(
        db
          .select()
          .from(commentFeedbacks)
          .where(userId ? eq(commentFeedbacks.userId, userId) : sql`false`)
      );

      const commentCounts = db.$with('comment_count').as(
        db
          .select({
            postId: comments.postId,
            count: count(comments.id).as('commentCount')
          })
          .from(comments)
          .groupBy(comments.id)
      );

      const likeCounts = db.$with('like_count').as(
        db
          .select({
            postId: commentFeedbacks.commentId,
            count: count(commentFeedbacks.commentId).as('likeCount')
          })
          .from(commentFeedbacks)
          .where(eq(commentFeedbacks.status, 'like'))
          .groupBy(commentFeedbacks.commentId)
      );

      const [total, data] = await Promise.all([
        db.$count(comments, eq(comments.postId, postId)),
        db
          .with(viewerFeedback, commentCounts, likeCounts)
          .select({
            ...getTableColumns(comments),
            user: users,
            feedback: viewerFeedback.status,
            commentCount: commentCounts.count,
            likeCount: likeCounts.count
          })
          .from(comments)
          .where(
            and(
              eq(comments.postId, postId),
              parentId ? eq(comments.parentId, parentId) : isNull(comments.parentId),
              cursor
                ? or(
                    lt(comments.updatedAt, cursor.updatedAt),
                    and(
                      eq(comments.updatedAt, cursor.updatedAt),
                      lt(comments.id, cursor.id)
                    )
                  )
                : undefined
            )
          )
          .innerJoin(users, eq(comments.userId, users.id))
          .leftJoin(viewerFeedback, eq(viewerFeedback.commentId, comments.id))
          .leftJoin(commentCounts, eq(commentCounts.postId, postId))
          .leftJoin(likeCounts, eq(likeCounts.postId, postId))
          .orderBy(desc(comments.updatedAt), desc(comments.id))
          .limit(limit + 1)
      ]);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.id, updatedAt: lastItem.updatedAt }
        : null;

      // await new Promise((res) => {
      //   setTimeout(() => {
      //     res(1);
      //   }, 3000);
      // });

      return { items, nextCursor, total };
    })
});
