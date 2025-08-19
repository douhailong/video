import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';
import { createWriteStream, createReadStream } from 'fs';
import { Readable, Writable } from 'stream';
import { pipeline } from 'stream/promises';
import ffmpeg from 'fluent-ffmpeg';
import { and, desc, eq, lt, or, ilike, getTableColumns } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

import { db } from '@/db';
import { comments, videoReactions, videos, videoViews } from '@/db/schema';
import { protectedProcedure, createTRPCRouter } from '@/trpc/init';
import { minio } from '@/lib/minio';

export const studioRouter = createTRPCRouter({
  uploadVideo: protectedProcedure
    .input(
      zfd.formData({
        file: zfd.file()
      })
    )
    .mutation(async ({ input }) => {
      const { file } = input;

      const uuid = randomUUID();
      const uploadDir = path.join(process.cwd(), 'uploads', 'm3u8');
      const filePath = path.join(uploadDir, 'playlist.m3u8');
      const segmentPath = path.join(uploadDir, 'segment%03d.ts');

      const stream = file.stream() as any as Readable;
      const writeStream = createWriteStream(filePath);

      await fs.mkdir(uploadDir, { recursive: true });
      // await pipeline(stream, writeStream);

      await new Promise((resolve) => {
        ffmpeg('http://47.117.82.112:9000/test/aa/ll/demo.mp4')
          .outputOptions(['-hls_time 5', '-hls_list_size 0', '-hls_segment_filename', segmentPath])
          .output(filePath)
          .on('end', resolve)
          .run();
      });

      return { success: true };
    }),
  getOne: protectedProcedure.input(z.object({ id: z.uuid() })).query(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { id } = input;

    const [video] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, id), eq(videos.authorId, userId)));

    if (!video) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return video;
  }),
  getMany: protectedProcedure
    .input(
      z.object({
        query: z.string().nullish(),
        cursor: z.object({ id: z.uuid(), updateAt: z.date() }).nullish(),
        limit: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit, query } = input;
      const { userId } = ctx;

      const [total, data] = await Promise.all([
        db.$count(
          videos,
          and(eq(videos.authorId, userId), query ? ilike(videos.title, `%${query}%`) : undefined)
        ),
        db
          .select({
            ...getTableColumns(videos),
            commentCount: db.$count(comments, eq(comments.videoId, videos.id)),
            viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
            likeCount: db.$count(
              videoReactions,
              and(eq(videoReactions.videoId, videos.id), eq(videoReactions.status, 'like'))
            )
          })
          .from(videos)
          .where(
            and(
              eq(videos.authorId, userId),
              query ? ilike(videos.title, `%${query}%`) : undefined,
              cursor
                ? or(
                    lt(videos.updatedAt, cursor.updateAt),
                    and(eq(videos.updatedAt, cursor.updateAt), lt(videos.id, cursor.id))
                  )
                : undefined
            )
          )
          .orderBy(desc(videos.updatedAt), desc(videos.id))
          .limit(limit + 1)
      ]);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore ? { id: lastItem.id, updateAt: lastItem.updatedAt } : null;

      return { items, nextCursor, total };
    })
});
