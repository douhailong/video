import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  inArray,
  isNotNull,
  lt,
  or,
  sql
} from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import {
  users,
  posts,
  postViews,
  postLikes,
  follows,
  videos,
  playlistPosts
} from '@/db/schema';
import { createTRPCRouter, suspenseProcedure, procedure } from '@/trpc/init';
import { mediaType, WEBSITE_ASSETS_BUCKET } from '@/lib/constants';
import { updatePostSchema } from '@/lib/zod';
import { buildSourceObjectId } from '@/lib/utils/s3';
import { minio } from '@/lib/minio';

const studio = createTRPCRouter({
  create: procedure
    .input(
      z.object({
        title: z.string(),
        type: z.enum(mediaType),
        file: z.object({
          name: z.string(),
          size: z.number().int(),
          type: z.string()
        })
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { type, title, file } = input;
      const { userId } = ctx;

      const defaultVal = {
        title: title.replace(/\.[^/.]+$/, ''),
        type,
        userId,
        visibility: 'private'
      } as const;

      return await db.transaction(async (tx) => {
        const [createdPost] = await tx.insert(posts).values(defaultVal).returning();

        if (!createdPost) {
          throw new TRPCError({ code: 'BAD_REQUEST' });
        }

        // TODO picture create

        const [createdVideo] = await tx
          .insert(videos)
          .values({
            postId: createdPost.id,
            name: file.name,
            size: file.size,
            mimeType: file.type
          })
          .returning();

        if (!createdVideo) {
          throw new TRPCError({ code: 'BAD_REQUEST' });
        }

        const uploadId = await minio.presignedPutObject(
          WEBSITE_ASSETS_BUCKET,
          buildSourceObjectId(type, createdVideo.id, title),
          60 * 10
        );

        if (!uploadId) {
          throw new TRPCError({ code: 'BAD_REQUEST' });
        }

        return { postId: createdPost.id, uploadId };
      });
    }),
  update: procedure
    .input(updatePostSchema.extend({ isPublished: z.boolean().nullish() }))
    .mutation(async ({ input, ctx }) => {
      const { id, playlistIds, isPublished, ...rest } = input;
      const { userId } = ctx;

      return await db.transaction(async (tx) => {
        const [updatedPost] = await tx
          .update(posts)
          .set({
            ...rest,
            // 无publishedAt是草稿
            publishedAt: !isPublished
              ? null
              : sql<Date>`COALESCE(${posts.publishedAt}, NOW())`
          })
          .where(and(eq(posts.id, id), eq(posts.userId, userId)))
          .returning();

        if (!updatedPost) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }

        if (playlistIds) {
          await tx.delete(playlistPosts).where(eq(playlistPosts.postId, id));

          if (playlistIds.length) {
            await tx.insert(playlistPosts).values(
              playlistIds.map((playlistId) => ({
                postId: id,
                playlistId
              }))
            );
          }
        }

        return updatedPost;
      });
    }),
  deleteMany: procedure
    .input(z.object({ ids: z.array(z.uuid()).min(1) }))
    .mutation(async ({ input, ctx }) => {
      const { ids } = input;
      const { userId } = ctx;

      const [deletedPosts] = await db
        .delete(posts)
        .where(and(inArray(posts.id, ids), eq(posts.userId, userId)))
        .returning();

      if (!deletedPosts) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      return deletedPosts;
    }),

  getOne: procedure
    .input(
      z.object({
        id: z.uuid()
      })
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const { userId } = ctx;

      const [data] = await db
        .select({
          ...getTableColumns(posts),
          media: videos,
          playlistIds: sql<
            string[]
          >`array_agg(${playlistPosts.playlistId}) FILTER (WHERE ${playlistPosts.playlistId} IS NOT NULL)`
        })
        .from(posts)
        .innerJoin(videos, eq(videos.postId, id))
        .leftJoin(playlistPosts, eq(playlistPosts.postId, id))
        .where(and(eq(posts.id, id), eq(posts.userId, userId)))
        .groupBy(posts.id, videos.id)
        .limit(1);

      if (!data) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return data;
    }),
  getMany: procedure
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
        eq(posts.userId, userId),
        query ? ilike(posts.title, `%${query}%`) : undefined
      );

      const [items, total] = await Promise.all([
        db
          .select({
            ...getTableColumns(posts),
            viewCount: db.$count(postViews, eq(postViews.postId, posts.id))
          })
          .from(posts)
          .where(where)
          .orderBy(desc(posts.updatedAt), desc(posts.id))
          .limit(pageSize)
          .offset((page - 1) * pageSize),
        db.$count(posts, where)
      ]);

      // await new Promise((res) => {
      //   setTimeout(() => {
      //     res(1);
      //   }, 2000);
      // });

      return {
        items,
        total,
        page,
        pageSize
      };
    })
});

const home = createTRPCRouter({
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

const recommend = createTRPCRouter({
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

export const postsRouter = createTRPCRouter({ home, studio, recommend });
