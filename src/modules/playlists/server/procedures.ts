import { and, desc, eq, lt, or } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { db } from '@/db';
import { playlists, users } from '@/db/schema';
import { procedure, createTRPCRouter } from '@/trpc/init';
import { VISIBLE_VALUES } from '@/lib/constants';

export const playlistRouter = createTRPCRouter({
  create: procedure
    .input(z.object({ name: z.string(), visible: z.enum(VISIBLE_VALUES) }))
    .mutation(async ({ input, ctx }) => {
      const { name, visible } = input;
      const { userId } = ctx;

      const [existingPlaylist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.name, name), eq(playlists.userId, userId)));

      if (existingPlaylist) {
        throw new TRPCError({ code: 'CONFLICT' });
      }

      const [cretedPlaylist] = await db
        .insert(playlists)
        .values({ name, visible, userId })
        .returning();

      if (!cretedPlaylist) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      return cretedPlaylist;
    }),
  update: procedure
    .input(
      z.object({
        name: z.string(),
        visible: z.enum(VISIBLE_VALUES),
        id: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, visible, id } = input;
      const { userId } = ctx;

      const [existingPlaylist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.id, id), eq(playlists.userId, userId)));

      if (!existingPlaylist) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const [updatedPlaylist] = await db
        .update(playlists)
        .set({ name, visible })
        .where(and(eq(playlists.id, id), eq(playlists.userId, userId)))
        .returning();

      if (!updatedPlaylist) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      return updatedPlaylist;
    }),
  // deleteMany: procedure.input().mutation(async ({ ctx }) => {
  //   const { userId } = ctx;
  // }),
  deleteOne: procedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const { userId } = ctx;

      const [existingPlaylist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.id, id), eq(playlists.userId, userId)));

      if (!existingPlaylist) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const [deletedPalylist] = await db
        .delete(playlists)
        .where(and(eq(playlists.id, id), eq(playlists.userId, userId)))
        .returning();

      if (!deletedPalylist) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
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
        visible: z.enum(VISIBLE_VALUES).nullish(),
        cursor: z.object({ id: z.uuid(), updateAt: z.date() }).nullish(),
        limit: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit, visible } = input;
      const { userId } = ctx;

      const data = await db
        .select()
        .from(playlists)
        .where(
          and(
            eq(playlists.userId, userId),
            visible ? eq(playlists.visible, visible) : undefined,
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
    })
});
