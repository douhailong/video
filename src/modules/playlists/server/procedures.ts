import { and, desc, eq, getTableColumns, ilike, lt, or } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { db } from '@/db';
import { playlists, users } from '@/db/schema';
import { procedure, createTRPCRouter } from '@/trpc/init';
import { visibility } from '@/lib/constants';

export const playlistRouter = createTRPCRouter({
  create: procedure
    .input(z.object({ name: z.string(), visibility: z.enum(visibility) }))
    .mutation(async ({ input, ctx }) => {
      const { name, visibility } = input;
      const { userId } = ctx;

      const [cretedPlaylist] = await db
        .insert(playlists)
        .values({ name, visibility, userId })
        .returning();

      if (!cretedPlaylist) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      return cretedPlaylist;
    }),
  update: procedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        visibility: z.enum(visibility)
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, visibility, id } = input;
      const { userId } = ctx;

      const [updatedPlaylist] = await db
        .update(playlists)
        .set({ name, visibility })
        .where(and(eq(playlists.id, id), eq(playlists.userId, userId)))
        .returning();

      if (!updatedPlaylist) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return updatedPlaylist;
    }),
  delete: procedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const { userId } = ctx;

      const [deletedPalylist] = await db
        .delete(playlists)
        .where(and(eq(playlists.id, id), eq(playlists.userId, userId)))
        .returning();

      if (!deletedPalylist) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return deletedPalylist;
    }),

  getOne: procedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const { id } = input;

    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));

    if (!playlist) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return playlist;
  }),
  getMany: procedure
    .input(
      z.object({
        visibility: z.enum(visibility).nullish(),
        cursor: z.object({ id: z.uuid(), updateAt: z.date() }).nullish(),
        limit: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit, visibility } = input;
      const { userId } = ctx;

      const data = await db
        .select()
        .from(playlists)
        .where(
          and(
            eq(playlists.userId, userId),
            visibility ? eq(playlists.visibility, visibility) : undefined,
            cursor
              ? or(
                  lt(playlists.updatedAt, cursor.updateAt),
                  and(
                    eq(playlists.updatedAt, cursor.updateAt),
                    lt(playlists.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(playlists.updatedAt), desc(playlists.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.id, updateAt: lastItem.updatedAt }
        : null;

      return { items, nextCursor };
    }),
  studioGetMany: procedure
    .input(
      z.object({
        query: z.string().nullish(),
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(10)
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, query } = input;
      const { userId } = ctx;

      const where = and(
        eq(playlists.userId, userId),
        query ? ilike(playlists.name, `%${query}%`) : undefined
      );

      const [items, total] = await Promise.all([
        db
          .select({
            ...getTableColumns(playlists)
            // viewCount: db.$count(postViews, eq(postViews.postId, posts.id))
          })
          .from(playlists)
          .where(where)
          .orderBy(desc(playlists.updatedAt), desc(playlists.id))
          .limit(pageSize)
          .offset((page - 1) * pageSize),
        db.$count(playlists, where)
      ]);

      return {
        items,
        total,
        page,
        pageSize
      };
    })
});
