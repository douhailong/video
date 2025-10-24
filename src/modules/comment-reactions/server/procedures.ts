import { and, eq, getTableColumns } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import { commentReactions } from '@/db/schema';
import { publicProcedure, procedure, createTRPCRouter } from '@/trpc/init';

export const commentReactionsRouter = createTRPCRouter({
  like: procedure
    .input(z.object({ commentId: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;
      const { userId } = ctx;

      const [existingReaction] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.reactorId, userId),
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.status, 'like')
          )
        );

      if (existingReaction) {
        const [deletedReaction] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.commentId, commentId),
              eq(commentReactions.reactorId, userId)
            )
          )
          .returning();

        return deletedReaction;
      }

      const [createdReaction] = await db
        .insert(commentReactions)
        .values({
          reactorId: userId,
          commentId,
          status: 'like'
        })
        // 冲突时更新 (创建时已经存在一条id相同的数据 如status === 'dislike')
        .onConflictDoUpdate({
          target: [commentReactions.reactorId, commentReactions.commentId],
          set: { status: 'like' }
        })
        .returning();

      return createdReaction;
    }),
  dislike: procedure
    .input(z.object({ commentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;
      const { userId } = ctx;

      const [existingReaction] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.reactorId, userId),
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.status, 'dislike')
          )
        );

      if (existingReaction) {
        const [deletedReaction] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.commentId, commentId),
              eq(commentReactions.reactorId, userId)
            )
          )
          .returning();

        return deletedReaction;
      }

      const [createdReaction] = await db
        .insert(commentReactions)
        .values({
          reactorId: userId,
          commentId,
          status: 'dislike'
        })
        .onConflictDoUpdate({
          target: [commentReactions.reactorId, commentReactions.commentId],
          set: { status: 'dislike' }
        })
        .returning();

      return createdReaction;
    })
});
