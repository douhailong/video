import { and, eq, getTableColumns } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import { subscriptions } from '@/db/schema';
import { procedure, protectedProcedure, createTRPCRouter } from '@/trpc/init';

export const subscriptionsRouter = createTRPCRouter({
  subscribe: protectedProcedure
    .input(z.object({ publisherId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { publisherId } = input;
      const { id: subscriberId } = ctx.user;

      if (publisherId === subscriberId) {
        throw new TRPCError({ code: 'CONFLICT' });
      }

      const [subscription] = await db
        .insert(subscriptions)
        .values({
          subscriberId,
          publisherId
        })
        .returning();

      return subscription;
    }),
  unsubscribe: protectedProcedure
    .input(z.object({ publisherId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { publisherId } = input;
      const { id: subscriberId } = ctx.user;

      if (publisherId === subscriberId) {
        throw new TRPCError({ code: 'CONFLICT' });
      }

      const [subscription] = await db
        .delete(subscriptions)
        .where(
          and(
            eq(subscriptions.publisherId, publisherId),
            eq(subscriptions.subscriberId, subscriberId)
          )
        )
        .returning();

      if (!subscription) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return subscription;
    })
});
