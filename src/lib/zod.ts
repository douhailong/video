import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';

import { posts } from '@/db/schema';

const omits = {
  createdAt: true,
  updatedAt: true,
  userId: true
} as const;

const basePostSchema = createInsertSchema(posts, {
  id: z.uuid(),
  title: (schema) =>
    schema.trim().min(1, '请为你的作品添加标题').max(100, '你的标题过长'),
  description: (schema) => schema.trim().max(5000, '你的介绍过长'),
  thumbUrl: () => z.httpUrl()
}).omit(omits);

export const createPostSchema = basePostSchema.omit({ id: true, publishedAt: true });

export const updatePostSchema = basePostSchema
  .omit({ type: true })
  .extend({ playlistIds: z.array(z.uuid()).nullish() });

export type CreatePostSchema = z.infer<typeof createPostSchema>;
export type UpdatePostSchema = z.infer<typeof updatePostSchema>;
