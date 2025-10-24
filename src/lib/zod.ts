import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';

import { posts, videos, pictures } from '@/db/schema';

const basePostSchema = createInsertSchema(posts, {
  title: (schema) => schema.trim().max(80, '作品标题最多80字符'),
  description: (schema) => schema.trim().max(1000, '作品介绍最多1000字符')
}).omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
  id: true
});

const videoSchema = createInsertSchema(videos).omit({
  postId: true
});

const pictureSchema = createInsertSchema(pictures).omit({
  postId: true
});

export const postSchema = z.discriminatedUnion('type', [
  basePostSchema.extend({
    type: z.literal('video'),
    video: videoSchema
  }),
  basePostSchema.extend({
    type: z.literal('picture'),
    picture: pictureSchema
  })
]);

export type PostSchema = z.infer<typeof postSchema>;
