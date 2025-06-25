import { and, eq, getTableColumns } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import { commentReactions } from '@/db/schema';
import { procedure, protectedProcedure, createTRPCRouter } from '@/trpc/init';

export const commentReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(z.object({ commentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;
      const { id: userId } = ctx.user;

      const [existingReaction] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.authorId, userId),
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.status, 'like')
          )
        );

      if (existingReaction) {
        const [deletedReaction] = await db
          .delete(commentReactions)
          .where(
            and(eq(commentReactions.commentId, commentId), eq(commentReactions.authorId, userId))
          )
          .returning();

        return deletedReaction;
      }

      const [createdReaction] = await db
        .insert(commentReactions)
        .values({
          authorId: userId,
          commentId,
          status: 'like'
        })
        // 冲突时更新 (创建时已经存在一条id相同的数据 如status === 'dislike')
        .onConflictDoUpdate({
          target: [commentReactions.authorId, commentReactions.commentId],
          set: { status: 'like' }
        })
        .returning();

      return createdReaction;
    }),
  dislike: protectedProcedure
    .input(z.object({ commentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;
      const { id: userId } = ctx.user;

      const [existingReaction] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.authorId, userId),
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.status, 'dislike')
          )
        );

      if (existingReaction) {
        const [deletedReaction] = await db
          .delete(commentReactions)
          .where(
            and(eq(commentReactions.commentId, commentId), eq(commentReactions.authorId, userId))
          )
          .returning();

        return deletedReaction;
      }

      const [createdReaction] = await db
        .insert(commentReactions)
        .values({
          authorId: userId,
          commentId,
          status: 'dislike'
        })
        .onConflictDoUpdate({
          target: [commentReactions.authorId, commentReactions.commentId],
          set: { status: 'dislike' }
        })
        .returning();

      return createdReaction;
    })
});
