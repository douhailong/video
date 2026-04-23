import { and, desc, eq, getTableColumns, lt, or, isNull, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { db } from '@/db';
import { commentLikes, comments, users } from '@/db/schema';
import { suspenseProcedure, procedure, createTRPCRouter } from '@/trpc/init';

export const commentsRouter = createTRPCRouter({
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

      const subComments = alias(comments, 'sub_comment');

      const [total, data] = await Promise.all([
        db.$count(comments, eq(comments.postId, postId)),
        db
          .select({
            ...getTableColumns(comments),
            user: users,
            likeStatus: commentLikes.status,
            likeCount: db.$count(
              commentLikes,
              and(
                eq(commentLikes.commentId, comments.id),
                eq(commentLikes.status, 'like')
              )
            ),
            repliedCount: parentId
              ? sql<null>`null`
              : db.$count(
                  db
                    .select()
                    .from(subComments)
                    .where(eq(subComments.parentId, comments.id))
                )
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
          .leftJoin(
            commentLikes,
            userId
              ? and(
                  eq(commentLikes.userId, userId),
                  eq(commentLikes.commentId, comments.id)
                )
              : sql`false`
          )
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
  delete: procedure
    .input(
      z.object({
        id: z.uuid()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const { userId } = ctx;

      const [deletedComment] = await db
        .delete(comments)
        .where(and(eq(comments.id, id), eq(comments.userId, userId)))
        .returning();

      if (!deletedComment) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return deletedComment;
    }),
  create: procedure
    .input(
      z.object({
        postId: z.uuid(),
        text: z.string(),
        parentId: z.uuid().nullish(),
        repliedId: z.uuid().nullish()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, parentId, repliedId, text } = input;
      const { userId } = ctx;

      async function createComment() {
        const [createdComment] = await db
          .insert(comments)
          .values({
            userId,
            postId,
            parentId,
            repliedId: parentId && repliedId ? repliedId : undefined,
            text
          })
          .returning();

        return createdComment;
      }

      if (!parentId && !repliedId) {
        return await createComment();
      }

      if (!parentId || !repliedId) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      const [repliedComment] = await db
        .select()
        .from(comments)
        .where(
          parentId === repliedId
            ? and(
                eq(comments.id, parentId),
                eq(comments.postId, postId),
                isNull(comments.parentId)
              )
            : and(
                eq(comments.id, repliedId),
                eq(comments.parentId, parentId),
                eq(comments.postId, postId)
              )
        );

      if (!repliedComment) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return await createComment();
    })
});
