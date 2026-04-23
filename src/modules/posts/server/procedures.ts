import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  lt,
  or,
  sql
} from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import { users, posts, postViews, postLikes, follows, videos } from '@/db/schema';
import { createTRPCRouter, suspenseProcedure, procedure } from '@/trpc/init';
import { mediaType } from '@/lib/constants';

export const postsRouter = createTRPCRouter({
  getOne: suspenseProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const { userId } = ctx;

      const [post] = await db
        .select({
          ...getTableColumns(posts),
          user: {
            ...getTableColumns(users),
            followed: isNotNull(follows.followerId).mapWith(Boolean),
            followerCount: db.$count(follows, eq(follows.followedId, users.id))
          },
          viewCount: db.$count(postViews, eq(postViews.postId, posts.id)),
          likeCount: db.$count(
            postLikes,
            and(eq(postLikes.postId, posts.id), eq(postLikes.status, 'like'))
          ),
          likeStatus: postLikes.status
        })
        .from(posts)
        .innerJoin(users, eq(users.id, posts.userId))
        .leftJoin(
          follows,
          and(
            eq(follows.followedId, posts.userId),
            userId ? eq(follows.followerId, userId) : sql`false`
          )
        )
        .leftJoin(
          postLikes,
          and(
            eq(postLikes.postId, posts.id),
            userId ? eq(postLikes.userId, userId) : sql`false`
          )
        )
        .where(and(eq(posts.id, id), eq(posts.visibility, 'public')));

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return post;
    }),

  getMany: suspenseProcedure
    .input(
      z.object({
        cursor: z.object({ id: z.uuid(), updateAt: z.date() }).nullish(),
        limit: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const { userId } = ctx;

      const data = await db
        .select({
          ...getTableColumns(posts),
          user: {
            ...getTableColumns(users),
            followed: isNotNull(follows.followerId).mapWith(Boolean)
          },
          viewCount: db.$count(postViews, eq(postViews.postId, posts.id))
        })
        .from(posts)
        .innerJoin(users, eq(users.id, posts.userId))
        .leftJoin(
          follows,
          and(
            eq(follows.followedId, posts.userId),
            userId ? eq(follows.followerId, userId) : sql`false`
          )
        )
        .where(
          and(
            eq(posts.visibility, 'public'),
            cursor
              ? or(
                  lt(posts.updatedAt, cursor.updateAt),
                  and(eq(posts.updatedAt, cursor.updateAt), lt(posts.id, cursor.id))
                )
              : undefined
          )
        )
        .orderBy(desc(posts.updatedAt), desc(posts.id))
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
