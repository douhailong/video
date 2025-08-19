import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';

import { videos } from '@/db/schema';

export const videoSchema = createInsertSchema(videos, {
  title: (schema) => schema.trim().max(80, '标题最长80字符')
}).omit({
  authorId: true,
  createdAt: true,
  updatedAt: true
});

export type VideoSchema = z.infer<typeof videoSchema>;
