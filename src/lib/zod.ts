import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';

import { posts } from '@/db/schema';

export const postSchema = createInsertSchema(posts, {
  title: (schema) => schema.trim().max(80, '标题最多80字符'),
  description: (schema) => schema.trim().max(1000, '简介最多1000字符')
}).omit({
  authorId: true,
  createdAt: true,
  updatedAt: true,
  status: true
});

export type PostSchema = z.infer<typeof postSchema>;
