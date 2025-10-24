import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import z from 'zod';

import { db } from '@/db';
import { categories } from '@/db/schema';
import { publicProcedure, procedure, createTRPCRouter } from '@/trpc/init';

export const categoriesRouter = createTRPCRouter({
  getMany: publicProcedure.query(async () => {
    const data = await db.select().from(categories);

    // await db
    //   .insert(categories)
    //   .values(a.map((i) => ({ name: i.name, description: `${i.name}` })));

    if (!data) {
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }

    return data;
  }),
  remove: procedure.input(z.object({ id: z.uuid() })).mutation(async ({ input, ctx }) => {
    const { id } = input;
    // const { role } = ctx;

    // if (role === 'user') {
    //   throw new TRPCError({ code: 'FORBIDDEN' });
    // }

    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();

    if (!deletedCategory) {
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }

    return deletedCategory;
  }),
  create: procedure
    .input(
      z.object({
        name: z.string().max(6),
        description: z.string().max(1000)
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, description } = input;
      // const { role } = ctx;

      // if (role === 'user') {
      //   throw new TRPCError({ code: 'FORBIDDEN' });
      // }

      const [createdCategory] = await db
        .insert(categories)
        .values({
          name,
          description
        })
        .returning();

      if (!createdCategory) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      return createdCategory;
    })
});

const a = [
  { name: '游戏' },
  { name: '音乐' },
  { name: '影视' },
  { name: '美食' },
  { name: '知识' },
  { name: '生活vlog' },
  { name: '小剧场' },
  { name: '体育' },
  { name: '旅行' },
  { name: '动物' },
  { name: '三农' },
  { name: '汽车' },
  { name: '美妆穿搭' }
];
