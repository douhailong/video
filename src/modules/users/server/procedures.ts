import { and, desc, eq, getTableColumns, lt, not, or } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { db } from '@/db';
import { users, follows } from '@/db/schema';
import { protectedProcedure, createTRPCRouter } from '@/trpc/init';

export const usersRouter = createTRPCRouter({
  getSelf: protectedProcedure.query(async ({ input, ctx }) => {
    const { userId } = ctx;

    const [user] = await db
      .select({
        ...getTableColumns(users),
        followers: db.$count(follows, eq(follows.followingId, users.id)),
        followings: db.$count(follows, eq(follows.followerId, users.id))
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return user;
  })
});
