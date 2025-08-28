import { cache } from 'react';
import { eq, inArray } from 'drizzle-orm';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

import { db } from '@/db';
import { users } from '@/db/schema';
import { auth } from '@/auth';
import { ratelimit } from '@/lib/redis';

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

export const createTRPCContext = cache(async () => {
  const session = await auth();
  const authUserId = session?.user?.id;

  return { authUserId };
});

const t = initTRPC.context<TRPCContext>().create({ transformer: superjson });

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const procedure = t.procedure;
export const suspenseProcedure = t.procedure.use(async function isAuthed({ ctx, next }) {
  const { authUserId } = ctx;

  const [user] = await db
    .select()
    .from(users)
    .where(inArray(users.id, authUserId ? [authUserId] : []));

  return next({
    ctx: {
      ...ctx,
      userId: user?.id
      // role: user.role
    }
  });
});

export const protectedProcedure = t.procedure.use(async function isAuthed({ ctx, next }) {
  if (!ctx.authUserId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  const [user] = await db.select().from(users).where(eq(users.id, ctx.authUserId));

  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  // const { success } = await ratelimit.limit(user.id);

  // if (!success) {
  //   throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });
  // }

  return next({
    ctx: {
      ...ctx,
      userId: user.id
      // role: user.role
    }
  });
});
