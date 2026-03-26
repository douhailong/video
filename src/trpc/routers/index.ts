import { createTRPCRouter } from '../init';

import { likesRouter } from '@/modules/likes/server/procedures';
import { followsRouter } from '@/modules/follows/server/procedures';
import { historyRouter } from '@/modules/history/server/procedures';
import { playlistRouter } from '@/modules/playlists/server/procedures';

// TODO
import { userRouter } from '@/modules/user/server/procedures';

import { uploadRouter } from '@/modules/upload/server/procedures';
import { createPostRouter } from '@/modules/create-post/server/procedures';
import { postsRouter } from '@/modules/posts/server/procedures';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { studioRouter } from '@/modules/studio/server';

import { commentsRouter } from '@/modules/comments/server/procedures';
import { commentReactionsRouter } from '@/modules/comment-reactions/server/procedures';
import { searchRouter } from '@/modules/search/server/procedures';

export const appRouter = createTRPCRouter({
  likes: likesRouter,
  follows: followsRouter,
  user: userRouter,
  history: historyRouter,
  playlists: playlistRouter,

  upload: uploadRouter,
  createPost: createPostRouter,
  posts: postsRouter,
  studio: studioRouter,
  comments: commentsRouter,
  commentReactions: commentReactionsRouter,
  categories: categoriesRouter,
  search: searchRouter
});

export type AppRouter = typeof appRouter;
