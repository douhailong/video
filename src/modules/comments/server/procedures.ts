import { and, desc, eq, getTableColumns, lt, or, inArray } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { db } from '@/db';
import { commentReactions, comments, users } from '@/db/schema';
import { suspenseProcedure, protectedProcedure, createTRPCRouter } from '@/trpc/init';

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        postId: z.uuid(),
        content: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, content } = input;
      const { userId } = ctx;

      const [createdComment] = await db
        .insert(comments)
        .values({ authorId: userId, postId, content })
        .returning();

      return createdComment;
    }),
  getMany: suspenseProcedure
    .input(
      z.object({
        postId: z.uuid(),
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
      const { postId, cursor, limit } = input;
      const { userId } = ctx;

      const viewerReactions = db.$with('viewer_reaction').as(
        db
          .select()
          .from(commentReactions)
          .where(inArray(commentReactions.reactorId, userId ? [userId] : []))
      );

      const [total, data] = await Promise.all([
        db.$count(comments, eq(comments.postId, postId)),
        db
          .with(viewerReactions)
          .select({
            ...getTableColumns(comments),
            user: users,
            reaction: viewerReactions.status,
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
          .leftJoin(viewerReactions, eq(viewerReactions.commentId, comments.id))
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
  remove: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
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
