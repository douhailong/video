import { and, eq, getTableColumns } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import { videoViews } from '@/db/schema';
import { procedure, protectedProcedure, createTRPCRouter } from '@/trpc/init';

export const videoViewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { videoId } = input;
      const { id: userId } = ctx.user;

      const [existingView] = await db
        .select()
        .from(videoViews)
        .where(and(eq(videoViews.authorId, userId), eq(videoViews.videoId, videoId)));

      if (existingView) {
        return existingView;
        throw new TRPCError({ code: 'CONFLICT' });
      }

      const [createdView] = await db
        .insert(videoViews)
        .values({
          authorId: userId,
          videoId
        })
        .returning();

      return createdView;
    })
});
