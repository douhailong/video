import { eq, sql, desc, count } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import {
  playlistPosts,
  playlists,
  postCollections,
  postLikes,
  posts,
  postViews,
  users
} from '@/db/schema';
import { createTRPCRouter, procedure } from '@/trpc/init';

export const youRouter = createTRPCRouter({
  getYou: procedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const sq = db.select().from(postViews).where(eq(postViews.userId, userId)).as('sq');

    const data = await db
      .select()
      .from(users)
      .leftJoin(sq, eq(sq.userId, userId))
      .where(eq(users.id, userId));

    if (!data) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    console.log(data, 'aaaaaaa----------------11');

    return data;
  })
});
