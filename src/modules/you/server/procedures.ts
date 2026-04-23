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

const SHELF_PREVIEW_LIMIT = 3;

type HistoryPreviewQuery = {
  postId: string;
  title: string;
  thumbUrl: string;
  watchTime: number;
  viewedAt: string;
  createdAt: string;
};

type PlaylistPreviewQuery = {
  id: string;
  name: string;
  visible: 'public' | 'private';
  updatedAt: string;
  postCount: number;
};

export const youRouter = createTRPCRouter({
  getYou: procedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const data = await db
      .select({
        user: users
      })
      .from(users)
      .where(eq(users.id, userId))
      .leftJoin(postViews, eq(postViews.userId, users.id));

    if (!data) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    console.log(data, '????????-----------------11');

    return data;
  })
});
