import {
  and,
  desc,
  eq,
  getTableColumns,
  lt,
  or,
  inArray,
  isNull,
  sql
} from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { db } from '@/db';
import { commentReactions, comments, users } from '@/db/schema';
import { suspenseProcedure, procedure, createTRPCRouter } from '@/trpc/init';

export const commentsRouter = createTRPCRouter({
  create: procedure
    .input(
      z.object({
        postId: z.uuid(),
        parentId: z.uuid().nullish(),
        feedbackId: z.uuid().nullish(),
        content: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, parentId, feedbackId, content } = input;
      const { userId } = ctx;

      const [existingComment] = await db
        .select()
        .from(comments)
        .where(inArray(comments.id, parentId ? [parentId] : []));

      if (!existingComment && parentId) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (existingComment?.parentId && parentId && !feedbackId) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      // const [feedbackComment] = await db
      //   .select()
      //   .from(comments)
      //   .where(and(eq(comments.parentId, parentId!)));

      const [createdComment] = await db
        .insert(comments)
        .values({
          authorId: userId,
          postId,
          parentId,
          feedbackId: parentId && feedbackId ? feedbackId : undefined,
          content
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

      const subComments = alias(comments, 'sub_comment');

      const viewerReaction = db.$with('viewer_reaction').as(
        db
          .select()
          .from(commentReactions)
          .where(inArray(commentReactions.reactorId, userId ? [userId] : []))
      );

      const [total, data] = await Promise.all([
        db.$count(comments, eq(comments.postId, postId)),
        db
          .with(viewerReaction)
          .select({
            ...getTableColumns(comments),
            user: users,
            reaction: viewerReaction.status,
            comments: db.$count(
              db.select().from(subComments).where(eq(subComments.parentId, comments.id))
            ),

            likes: db.$count(
              commentReactions,
              and(
                eq(commentReactions.commentId, comments.id),
                eq(commentReactions.status, 'like')
              )
            ),
            dislikes: db.$count(
              commentReactions,
              and(
                eq(commentReactions.commentId, comments.id),
                eq(commentReactions.status, 'dislike')
              )
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
          .innerJoin(users, eq(comments.authorId, users.id))
          .leftJoin(viewerReaction, eq(viewerReaction.commentId, comments.id))
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
    }),
  remove: procedure.input(z.object({ id: z.uuid() })).mutation(async ({ ctx, input }) => {
    const { id } = input;
    const { userId } = ctx;

    const [removedComment] = await db
      .delete(comments)
      .where(and(eq(comments.id, id), eq(comments.authorId, userId)))
      .returning();

    if (!removedComment) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return removedComment;
  })
});
