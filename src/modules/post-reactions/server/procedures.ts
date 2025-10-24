import { and, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { db } from '@/db';
import { postReactions } from '@/db/schema';
import { procedure, createTRPCRouter } from '@/trpc/init';

export const postReactionsRouter = createTRPCRouter({
  like: procedure
    .input(z.object({ postId: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { postId } = input;
      const { userId } = ctx;

      const [existingReaction] = await db
        .select()
        .from(postReactions)
        .where(
          and(
            eq(postReactions.reactorId, userId),
            eq(postReactions.postId, postId),
            eq(postReactions.status, 'like')
          )
        );

      if (existingReaction) {
        const [deletedReaction] = await db
          .delete(postReactions)
          .where(
            and(eq(postReactions.postId, postId), eq(postReactions.reactorId, userId))
          )
          .returning();

        return deletedReaction;
      }

      const [createdReaction] = await db
        .insert(postReactions)
        .values({
          reactorId: userId,
          postId,
          status: 'like'
        })
        // 冲突时更新 (创建时已经存在一条id相同的数据 如status === 'dislike')
        .onConflictDoUpdate({
          target: [postReactions.reactorId, postReactions.postId],
          set: { status: 'like' }
        })
        .returning();

      return createdReaction;
    }),
  dislike: procedure
    .input(z.object({ postId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { postId } = input;
      const { userId } = ctx;

      const [existingReaction] = await db
        .select()
        .from(postReactions)
        .where(
          and(
            eq(postReactions.reactorId, userId),
            eq(postReactions.postId, postId),
            eq(postReactions.status, 'dislike')
          )
        );

      if (existingReaction) {
        const [deletedReaction] = await db
          .delete(postReactions)
          .where(
            and(eq(postReactions.postId, postId), eq(postReactions.reactorId, userId))
          )
          .returning();

        return deletedReaction;
      }

      const [createdReaction] = await db
        .insert(postReactions)
        .values({
          reactorId: userId,
          postId,
          status: 'dislike'
        })
        .onConflictDoUpdate({
          target: [postReactions.reactorId, postReactions.postId],
          set: { status: 'dislike' }
        })
        .returning();

      return createdReaction;
    })
});
