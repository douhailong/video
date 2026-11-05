import { and, desc, eq, getTableColumns, ilike, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import { posts, postViews, videos, playlistPosts } from '@/db/schema';
import { createTRPCRouter, procedure } from '@/trpc/init';
import { WEBSITE_ASSETS_BUCKET } from '@/lib/constants';
import { updatePostSchema } from '@/lib/zod';
import { minio } from '@/lib/minio';
import {
  MAX_UPLOAD_BYTES,
  UPLOAD_URL_TTL_SECONDS,
  validateVideoFile
} from '../uploads/config';
import {
  confirmUpload,
  ownedUpload,
  sourceExists,
  sourceObjectKey
} from '../uploads/server/upload-service';

export const studioPost = createTRPCRouter({
  create: procedure
    .input(
      z.object({
        requestId: z.uuid(),
        title: z.string().trim().min(1).max(255),
        type: z.literal('video'),
        file: z.object({
          name: z.string().min(1).max(255),
          size: z.number().int().positive().max(MAX_UPLOAD_BYTES),
          type: z.enum(['video/mp4', 'video/webm'])
        })
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { type, title, file, requestId } = input;
      const { userId } = ctx;
      try {
        validateVideoFile(file);
      } catch (error) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: (error as Error).message });
      }
      return await db.transaction(async (tx) => {
        const [createdPost] = await tx
          .insert(posts)
          .values({
            title: title.replace(/\.[^/.]+$/, '') || title,
            type,
            userId,
            visibility: 'private',
            uploadRequestId: requestId
          })
          .onConflictDoNothing({ target: [posts.userId, posts.uploadRequestId] })
          .returning();
        if (!createdPost) {
          const [existing] = await tx
            .select({ postId: posts.id, video: videos })
            .from(posts)
            .innerJoin(videos, eq(videos.postId, posts.id))
            .where(and(eq(posts.userId, userId), eq(posts.uploadRequestId, requestId)))
            .limit(1);
          if (
            !existing ||
            existing.video.name !== file.name ||
            existing.video.size !== file.size ||
            existing.video.mimeType !== file.type
          ) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: '同一上传任务不能更换文件'
            });
          }
          return { postId: existing.postId, videoId: existing.video.id };
        }
        const videoId = crypto.randomUUID();
        const [createdVideo] = await tx
          .insert(videos)
          .values({
            id: videoId,
            postId: createdPost.id,
            name: file.name,
            size: file.size,
            mimeType: file.type,
            sourceId: sourceObjectKey(videoId, file.name)
          })
          .returning();

        if (!createdVideo) {
          throw new TRPCError({ code: 'BAD_REQUEST' });
        }

        return { postId: createdPost.id, videoId: createdVideo.id };
      });
    }),
  getUploadUrl: procedure
    .input(z.object({ postId: z.uuid() }))
    .mutation(async ({ input, ctx }) => {
      const video = await ownedUpload(input.postId, ctx.userId);
      if (video.uploadStatus === 'uploaded') return { kind: 'uploaded' as const };
      if (video.uploadStatus === 'cancelled' || !video.sourceId) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: '上传任务已取消或缺少源文件信息'
        });
      }
      // A lost PUT response must not cause a second upload of an already stored file.
      try {
        if (await sourceExists(video)) {
          await confirmUpload(video);
          return { kind: 'uploaded' as const };
        }
      } catch (error) {
        if (!(error instanceof TRPCError) || error.code !== 'PRECONDITION_FAILED')
          throw error;
      }
      const uploadUrl = await minio.presignedPutObject(
        WEBSITE_ASSETS_BUCKET,
        video.sourceId,
        UPLOAD_URL_TTL_SECONDS
      );
      const [updated] = await db
        .update(videos)
        .set({ uploadStatus: 'uploading' })
        .where(
          and(
            eq(videos.id, video.id),
            inArray(videos.uploadStatus, ['pending', 'uploading'])
          )
        )
        .returning({ id: videos.id });
      if (!updated) {
        const current = await ownedUpload(input.postId, ctx.userId);
        if (current.uploadStatus === 'uploaded') return { kind: 'uploaded' as const };
        throw new TRPCError({
          code: 'CONFLICT',
          message: '上传状态已改变，请重新查看任务'
        });
      }
      return {
        kind: 'upload' as const,
        uploadUrl,
        mimeType: video.mimeType,
        expiresAt: Date.now() + UPLOAD_URL_TTL_SECONDS * 1000
      };
    }),
  completeUpload: procedure
    .input(z.object({ postId: z.uuid() }))
    .mutation(async ({ input, ctx }) => {
      return confirmUpload(await ownedUpload(input.postId, ctx.userId));
    }),
  cancelUpload: procedure
    .input(z.object({ postId: z.uuid() }))
    .mutation(async ({ input, ctx }) => {
      const video = await ownedUpload(input.postId, ctx.userId);
      const [cancelled] = await db
        .update(videos)
        .set({ uploadStatus: 'cancelled' })
        .where(
          and(
            eq(videos.id, video.id),
            inArray(videos.uploadStatus, ['pending', 'uploading'])
          )
        )
        .returning({ id: videos.id });
      if (cancelled) return { uploadStatus: 'cancelled' as const };
      const current = await ownedUpload(input.postId, ctx.userId);
      return {
        uploadStatus:
          current.uploadStatus === 'uploaded'
            ? ('uploaded' as const)
            : ('cancelled' as const)
      };
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
            uploadStatus: videos.uploadStatus,
            mediaStatus: videos.status,
            viewCount: db.$count(postViews, eq(postViews.postId, posts.id))
          })
          .from(posts)
          .leftJoin(videos, eq(videos.postId, posts.id))
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
