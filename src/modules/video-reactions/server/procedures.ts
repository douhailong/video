import { and, eq, getTableColumns } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import { videoReactions } from '@/db/schema';
import { protectedProcedure, createTRPCRouter } from '@/trpc/init';

export const videoReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(z.object({ videoId: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { videoId } = input;
      const { userId } = ctx;

      const [existingReaction] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.viewerId, userId),
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.status, 'like')
          )
        );

      if (existingReaction) {
        const [deletedReaction] = await db
          .delete(videoReactions)
          .where(and(eq(videoReactions.videoId, videoId), eq(videoReactions.viewerId, userId)))
          .returning();

        return deletedReaction;
      }

      const [createdReaction] = await db
        .insert(videoReactions)
        .values({
          viewerId: userId,
          videoId,
          status: 'like'
        })
        // 冲突时更新 (创建时已经存在一条id相同的数据 如status === 'dislike')
        .onConflictDoUpdate({
          target: [videoReactions.viewerId, videoReactions.videoId],
          set: { status: 'like' }
        })
        .returning();

      return createdReaction;
    }),
  dislike: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { videoId } = input;
      const { userId } = ctx;

      const [existingReaction] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.viewerId, userId),
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.status, 'dislike')
          )
        );

      if (existingReaction) {
        const [deletedReaction] = await db
          .delete(videoReactions)
          .where(and(eq(videoReactions.videoId, videoId), eq(videoReactions.viewerId, userId)))
          .returning();

        return deletedReaction;
      }

      const [createdReaction] = await db
        .insert(videoReactions)
        .values({
          viewerId: userId,
          videoId,
          status: 'dislike'
        })
        .onConflictDoUpdate({
          target: [videoReactions.viewerId, videoReactions.videoId],
          set: { status: 'dislike' }
        })
        .returning();

      return createdReaction;
    })
});
