import { db } from '@/db';
import { categories } from '@/db/schema';
import { procedure, createTRPCRouter } from '@/trpc/init';
import { TRPCError } from '@trpc/server';

export const categoriesRouter = createTRPCRouter({
  getMany: procedure.query(async () => {
    const data = await db.select().from(categories);

    if (!data) {
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }

    return data;
  })
});
