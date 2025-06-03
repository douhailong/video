import { db } from "@/db";
import { categories } from "@/db/schema";
import { procedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const categoriesRouter = createTRPCRouter({
  getMany: procedure.query(async () => {
    // throw new TRPCError({ code: "BAD_GATEWAY" });

    const data = await db.select().from(categories);

    return data;
  }),
});
