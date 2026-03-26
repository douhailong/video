import { and, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { db } from '@/db';
import { commentLikes, postLikes } from '@/db/schema';
import { procedure, createTRPCRouter } from '@/trpc/init';

export const likesRouter = createTRPCRouter({
  post: createTRPCRouter({
    like: procedure
      .input(z.object({ postId: z.uuid() }))
      .mutation(async ({ ctx, input }) => {
        const { postId } = input;
        const { userId } = ctx;

        const [existingReaction] = await db
          .select()
          .from(postLikes)
          .where(
            and(
              eq(postLikes.userId, userId),
              eq(postLikes.postId, postId),
              eq(postLikes.status, 'like')
            )
          );

        if (existingReaction) {
          const [deletedReaction] = await db
            .delete(postLikes)
            .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
            .returning();

          return deletedReaction;
        }

        const [createdReaction] = await db
          .insert(postLikes)
          .values({
            userId: userId,
            postId,
            status: 'like'
          })
          // 冲突时更新 (创建时已经存在一条id相同的数据 如status === 'dislike')
          .onConflictDoUpdate({
            target: [postLikes.userId, postLikes.postId],
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
          .from(postLikes)
          .where(
            and(
              eq(postLikes.userId, userId),
              eq(postLikes.postId, postId),
              eq(postLikes.status, 'dislike')
            )
          );

        if (existingReaction) {
          const [deletedReaction] = await db
            .delete(postLikes)
            .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
            .returning();

          return deletedReaction;
        }

        const [createdReaction] = await db
          .insert(postLikes)
          .values({
            userId: userId,
            postId,
            status: 'dislike'
          })
          .onConflictDoUpdate({
            target: [postLikes.userId, postLikes.postId],
            set: { status: 'dislike' }
          })
          .returning();

        return createdReaction;
      })
  }),
  comment: createTRPCRouter({
    like: procedure
      .input(z.object({ commentId: z.uuid() }))
      .mutation(async ({ ctx, input }) => {
        const { commentId } = input;
        const { userId } = ctx;

        const [existingReaction] = await db
          .select()
          .from(commentLikes)
          .where(
            and(
              eq(commentLikes.userId, userId),
              eq(commentLikes.commentId, commentId),
              eq(commentLikes.status, 'like')
            )
          );

        if (existingReaction) {
          const [deletedReaction] = await db
            .delete(commentLikes)
            .where(
              and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId))
            )
            .returning();

          return deletedReaction;
        }

        const [createdReaction] = await db
          .insert(commentLikes)
          .values({
            userId: userId,
            commentId,
            status: 'like'
          })
          // 冲突时更新 (创建时已经存在一条id相同的数据 如status === 'dislike')
          .onConflictDoUpdate({
            target: [commentLikes.userId, commentLikes.commentId],
            set: { status: 'like' }
          })
          .returning();

        return createdReaction;
      }),
    dislike: procedure
      .input(z.object({ commentId: z.uuid() }))
      .mutation(async ({ ctx, input }) => {
        const { commentId } = input;
        const { userId } = ctx;

        const [existingReaction] = await db
          .select()
          .from(commentLikes)
          .where(
            and(
              eq(commentLikes.userId, userId),
              eq(commentLikes.commentId, commentId),
              eq(commentLikes.status, 'dislike')
            )
          );

        if (existingReaction) {
          const [deletedReaction] = await db
            .delete(commentLikes)
            .where(
              and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId))
            )
            .returning();

          return deletedReaction;
        }

        const [createdReaction] = await db
          .insert(commentLikes)
          .values({
            userId: userId,
            commentId,
            status: 'dislike'
          })
          .onConflictDoUpdate({
            target: [commentLikes.userId, commentLikes.commentId],
            set: { status: 'dislike' }
          })
          .returning();

        return createdReaction;
      })
  })
});
