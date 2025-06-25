import { and, desc, eq, getTableColumns, lt, or, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import { commentReactions, comments, users } from '@/db/schema';
import { procedure, protectedProcedure, createTRPCRouter } from '@/trpc/init';

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        value: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { videoId, value } = input;
      const { id: userId } = ctx.user;

      const [createdComment] = await db
        .insert(comments)
        .values({ authorId: userId, videoId, value })
        .returning();

      return createdComment;
    }),
  getMany: procedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        cursor: z
          .object({
            updatedAt: z.date(),
            id: z.string().uuid()
          })
          .nullish(),
        limit: z.number()
      })
    )
    .query(async ({ input, ctx }) => {
      const { videoId, cursor, limit } = input;
      const { clerkUserId } = ctx;

      const [user] = await db
        .select()
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

      const userId = user ? user.id : undefined;

      const viewerReactions = db.$with('viewer_reactions').as(
        db
          .select({ commentId: commentReactions.commentId, status: commentReactions.status })
          .from(commentReactions)
          .where(inArray(commentReactions.authorId, userId ? [userId] : []))
      );

      const [total, data] = await Promise.all([
        db.$count(comments, eq(comments.videoId, videoId)),
        db
          .with(viewerReactions)
          .select({
            ...getTableColumns(comments),
            user: users,
            viewerReaction: viewerReactions.status,
            likeCount: db.$count(
              commentReactions,
              and(eq(commentReactions.commentId, comments.id), eq(commentReactions.status, 'like'))
            ),
            dislikeCount: db.$count(
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
              eq(comments.videoId, videoId),
              cursor
                ? or(
                    lt(comments.updatedAt, cursor.updatedAt),
                    and(eq(comments.updatedAt, cursor.updatedAt), lt(comments.id, cursor.id))
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
      const nextCursor = hasMore ? { id: lastItem.id, updatedAt: lastItem.updatedAt } : null;

      return { items, nextCursor, total };
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const { id: userId } = ctx.user;

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
