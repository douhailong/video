import { and, desc, eq, getTableColumns, inArray, ilike, sql } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import { minio } from '@/lib/minio';
import {
  posts,
  videos,
  playlists,
  playlistPosts,
  postViews,
  users,
  follows
} from '@/db/schema';
import { createTRPCRouter, procedure } from '@/trpc/init';
import { mediaType, WEBSITE_ASSETS_BUCKET } from '@/lib/constants';
import { buildSourceObjectId } from '@/lib/utils/s3';
import { updatePostSchema } from '@/lib/zod';

export const studioPostRouter = createTRPCRouter({
  create: procedure
    .input(
      z.object({
        title: z.string(),
        type: z.enum(mediaType)
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { type, title } = input;
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
          .values({ postId: createdPost.id })
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
