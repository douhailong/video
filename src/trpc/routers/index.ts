import { createTRPCRouter } from '../init';

import { searchRouter } from '@/modules/search/server/procedures';
import { likesRouter } from '@/modules/likes/server/procedures';
import { followsRouter } from '@/modules/follows/server/procedures';
import { historyRouter } from '@/modules/history/server/procedures';
import { playlistRouter } from '@/modules/playlists/server/procedures';
import { userRouter } from '@/modules/user/server/procedures';
import { uploadRouter } from '@/modules/upload/server/procedures';
import { postsRouter } from '@/modules/posts/server/procedures';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { commentsRouter } from '@/modules/comments/server/procedures';
import { youRouter } from '@/modules/you/server/procedures';

export const appRouter = createTRPCRouter({
  search: searchRouter,
  likes: likesRouter,
  follows: followsRouter,
  user: userRouter,
  history: historyRouter,
  playlists: playlistRouter,
  you: youRouter,
  upload: uploadRouter,
  posts: postsRouter,
  comments: commentsRouter,
  categories: categoriesRouter
});

export type AppRouter = typeof appRouter;
