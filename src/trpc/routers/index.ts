import { createTRPCRouter } from '../init';

import { searchRouter } from '@/modules/search/server/procedures';
import { likesRouter } from '@/modules/likes/server/procedures';
import { followsRouter } from '@/modules/follows/server/procedures';
import { historyRouter } from '@/modules/history/server/procedures';
import { playlistRouter } from '@/modules/playlists/server/procedures';

import { studioPostRouter } from '@/modules/studio-post/server/procedures';
// TODO
import { userRouter } from '@/modules/user/server/procedures';
import { watchRouter } from '@/modules/watch/server/procedures';

import { uploadRouter } from '@/modules/upload/server/procedures';
import { postsRouter } from '@/modules/posts/server/procedures';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { studioRouter } from '@/modules/studio/server';

import { commentsRouter } from '@/modules/comments/server/procedures';
import { commentReactionsRouter } from '@/modules/comment-reactions/server/procedures';
import { youRouter } from '@/modules/you/server/procedures';

export const appRouter = createTRPCRouter({
  search: searchRouter,

  likes: likesRouter,
  follows: followsRouter,
  user: userRouter,
  history: historyRouter,
  playlists: playlistRouter,
  you: youRouter,
  watch: watchRouter,

  studioPost: studioPostRouter,
  upload: uploadRouter,
  posts: postsRouter,
  studio: studioRouter,
  comments: commentsRouter,
  commentReactions: commentReactionsRouter,
  categories: categoriesRouter
});

export type AppRouter = typeof appRouter;
