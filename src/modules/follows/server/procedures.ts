import { and, eq, getTableColumns } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import { follows } from '@/db/schema';
import { procedure, createTRPCRouter } from '@/trpc/init';

export const followsRouter = createTRPCRouter({
  follow: procedure.input(z.object({ id: z.uuid() })).mutation(async ({ ctx, input }) => {
    const { id } = input;
    const { userId } = ctx;

    if (id === userId) {
      throw new TRPCError({ code: 'CONFLICT' });
    }

    const [createdFollow] = await db
      .insert(follows)
      .values({
        followerId: userId,
        followingId: id
      })
      .returning();

    if (!createdFollow) {
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }

    return createdFollow;
  }),
  unfollow: procedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const { userId } = ctx;

      if (id === userId) {
        throw new TRPCError({ code: 'CONFLICT' });
      }

      const [createdUnfollow] = await db
        .delete(follows)
        .where(and(eq(follows.followerId, userId), eq(follows.followingId, id)))
        .returning();

      if (!createdUnfollow) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return createdUnfollow;
    })
});
