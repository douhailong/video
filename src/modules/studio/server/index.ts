import { createTRPCRouter } from '@/trpc/init';

import { postsRouter } from './posts';

export const studioRouter = createTRPCRouter({
  posts: postsRouter
});
