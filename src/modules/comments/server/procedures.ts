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
import { commentLikes, comments, users } from '@/db/schema';
import { suspenseProcedure, procedure, createTRPCRouter } from '@/trpc/init';

export const commentsRouter = createTRPCRouter({
  create: procedure
    .input(
      z.object({
        postId: z.uuid(),
        text: z.string(),
        parentId: z.uuid().nullish(),
        feedbackId: z.uuid().nullish()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, parentId, feedbackId, text } = input;
      const { userId } = ctx;

      function queryWhere() {
        if (!parentId) {
          return sql`false`;
        }

        if (!feedbackId) {
          return eq(comments.id, parentId);
        }

        return and(eq(comments.parentId, parentId), eq(comments.id, feedbackId));
      }

      // 当前回复的评论
      const [existing] = await db.select().from(comments).where(queryWhere());

      // parentId没查到对应的一级评论
      if (!existing && parentId) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      // 回复的评论和当前评论属于同一个一级评论下
      if (existing && existing.parentId === parentId && !feedbackId) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      const [createdComment] = await db
        .insert(comments)
        .values({
          userId,
          postId,
          parentId,
          feedbackId: parentId && feedbackId ? feedbackId : undefined,
          text
        })
        .returning();

      return createdComment;
    }),
  getMany: suspenseProcedure
    .input(
      z.object({
        postId: z.uuid(),
        parentId: z.uuid().nullish(),
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
      const { postId, parentId, cursor, limit } = input;
      const { userId } = ctx;

      const viewerLikes = db.$with('viewer_like').as(
        db
          .select()
          .from(commentLikes)
          .where(userId ? eq(commentLikes.userId, userId) : sql`false`)
      );

      // const commentCounts = db.$with('comment_count').as(
      //   db
      //     .select({
      //       postId: comments.postId,
      //       count: count(comments.id).as('commentCount')
      //     })
      //     .from(comments)
      //     .groupBy(comments.id)
      // );

      // const likeCounts = db.$with('like_count').as(
      //   db
      //     .select({
      //       postId: commentLikes.commentId,
      //       count: count(commentLikes.commentId).as('likeCount')
      //     })
      //     .from(commentLikes)
      //     .where(eq(commentLikes.status, 'like'))
      //     .groupBy(commentLikes.commentId)
      // );

      const [total, data] = await Promise.all([
        db.$count(comments, eq(comments.postId, postId)),
        db
          .with(viewerLikes)
          // .with(viewerFeedback, commentCounts, likeCounts)
          .select({
            ...getTableColumns(comments),
            user: users,
            likeCount: db.$count(
              commentLikes,
              and(
                eq(commentLikes.commentId, comments.id),
                eq(commentLikes.status, 'like')
              )
            ),
            likeStatus: viewerLikes.status
            // feedback: viewerFeedback.status,
            // commentCount: commentCounts.count,
            // likeCount: likeCounts.count
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
          .leftJoin(viewerLikes, eq(viewerLikes.commentId, comments.id))
          // .leftJoin(commentCounts, eq(commentCounts.postId, postId))
          // .leftJoin(likeCounts, eq(likeCounts.postId, postId))
          .orderBy(desc(comments.updatedAt), desc(comments.id))
          .limit(limit + 1)
      ]);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.id, updatedAt: lastItem.updatedAt }
        : null;

      return { items, nextCursor, total };
    }),
  deleteOne: procedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const { userId } = ctx;

      const [comment] = await db
        .delete(comments)
        .where(and(eq(comments.id, id), eq(comments.userId, userId)))
        .returning();

      if (!comment) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return comment;
    })
});
