import { and, desc, eq, getTableColumns, inArray, isNotNull, lt, or } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import { minio } from '@/lib/minio';
import { users, posts, postViews, postLikes, postType } from '@/db/schema';
import { createTRPCRouter, procedure } from '@/trpc/init';
import { MINIO_BUCKET } from '@/lib/constants';

export const createPostRouter = createTRPCRouter({
  uploadUrl: procedure
    .input(
      z.object({
        filename: z.string(),
        category: z.string()
      })
    )
    .mutation(async ({ input: { category, filename } }) => {
      console.log(postType, '?????????');

      const uploadDir = `/${category}/${filename}`;

      const uploadUrl = await minio.presignedPutObject(MINIO_BUCKET, uploadDir, 60 * 10);

      return { uploadUrl, uploadDir };
    }),
  getMany: procedure
    .input(
      z.object({
        cursor: z.object({ id: z.uuid(), updateAt: z.date() }).nullish(),
        limit: z.number()
      })
    )
    .query(async () => {
      await new Promise((res) => {
        setTimeout(() => {
          res(1);
        }, 2000);
      });

      return { nextCursor: { id: '', updateAt: new Date() } };
    })
});
