import { eq, sql } from 'drizzle-orm';
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

    // Keep the page data in a single round-trip while avoiding row explosion
    // from joining multiple one-to-many relations together.
    const [you] = await db
      .select({
        user: {
          id: users.id,
          name: users.name,
          image: users.image
        }
        // historyTotal: sql<number>`
        //   (
        //     select count(*)::int
        //     from ${postViews}
        //     where ${postViews.userId} = ${users.id}
        //   )
        // `.mapWith(Number),
        // historyItems: sql<HistoryPreviewQuery[]>`
        //   coalesce(
        //     (
        //       select json_agg(
        //         history_item
        //         order by history_item."viewedAt" desc, history_item."postId" desc
        //       )
        //       from (
        //         select
        //           ${postViews.postId} as "postId",
        //           ${postViews.watchTime} as "watchTime",
        //           ${postViews.updatedAt} as "viewedAt",
        //           ${posts.title} as "title",
        //           ${posts.thumbUrl} as "thumbUrl",
        //           ${posts.createdAt} as "createdAt"
        //         from ${postViews}
        //         inner join ${posts} on ${posts.id} = ${postViews.postId}
        //         where ${postViews.userId} = ${users.id}
        //         order by ${postViews.updatedAt} desc, ${postViews.postId} desc
        //         limit ${SHELF_PREVIEW_LIMIT}
        //       ) history_item
        //     ),
        //     '[]'::json
        //   )
        // `,
        // playlistTotal: sql<number>`
        //   (
        //     select count(*)::int
        //     from ${playlists}
        //     where ${playlists.userId} = ${users.id}
        //   )
        // `.mapWith(Number),
        // playlistItems: sql<PlaylistPreviewQuery[]>`
        //   coalesce(
        //     (
        //       select json_agg(
        //         playlist_item
        //         order by playlist_item."updatedAt" desc, playlist_item.id desc
        //       )
        //       from (
        //         select
        //           ${playlists.id} as id,
        //           ${playlists.name} as name,
        //           ${playlists.visible} as visible,
        //           ${playlists.updatedAt} as "updatedAt",
        //           (
        //             select count(*)::int
        //             from ${playlistPosts}
        //             where ${playlistPosts.playlistId} = ${playlists.id}
        //           ) as "postCount"
        //         from ${playlists}
        //         where ${playlists.userId} = ${users.id}
        //         order by ${playlists.updatedAt} desc, ${playlists.id} desc
        //         limit ${SHELF_PREVIEW_LIMIT}
        //       ) playlist_item
        //     ),
        //     '[]'::json
        //   )
        // `,
        // savedTotal: sql<number>`
        //   (
        //     select count(*)::int
        //     from ${postCollections}
        //     where ${postCollections.userId} = ${users.id}
        //   )
        // `.mapWith(Number),
        // likedTotal: sql<number>`
        //   (
        //     select count(*)::int
        //     from ${postLikes}
        //     where ${postLikes.userId} = ${users.id}
        //       and ${postLikes.status} = ${'like'}
        //   )
        // `.mapWith(Number)
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!you) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    await new Promise((res) => {
      setTimeout(() => res(1), 2000);
    });

    return {
      user: you.user
      // history: {
      //   total: you.historyTotal,
      //   items: you.historyItems.map((item) => ({
      //     ...item,
      //     viewedAt: new Date(item.viewedAt),
      //     createdAt: new Date(item.createdAt)
      //   }))
      // },
      // playlists: {
      //   total: you.playlistTotal,
      //   items: you.playlistItems.map((item) => ({
      //     ...item,
      //     updatedAt: new Date(item.updatedAt)
      //   }))
      // },
      // savedVideos: {
      //   total: you.savedTotal
      // },
      // likedVideos: {
      //   total: you.likedTotal
      // }
    };
  })
});
