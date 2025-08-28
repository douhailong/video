import { and, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { db } from '@/db';
import { postViews } from '@/db/schema';
import { protectedProcedure, createTRPCRouter } from '@/trpc/init';

export const postViewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ postId: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { postId } = input;
      const { userId } = ctx;

      const [existingView] = await db
        .select()
        .from(postViews)
        .where(and(eq(postViews.viewerId, userId), eq(postViews.postId, postId)));

      if (existingView) {
        throw new TRPCError({ code: 'CONFLICT' });
      }

      const [createdView] = await db
        .insert(postViews)
        .values({
          viewerId: userId,
          postId
        })
        .returning();

      return createdView;
    })
});
