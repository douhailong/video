import { createTRPCRouter } from '../init';

import { uploadRouter } from '@/modules/upload/server/procedures';
import { likeRouter } from '@/modules/likes/server/procedures';

import { createPostRouter } from '@/modules/create-post/server/procedures';
import { postsRouter } from '@/modules/posts/server/procedures';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { studioRouter } from '@/modules/studio/server';
import { postViewsRouter } from '@/modules/post-views/server/procedures';

import { followsRouter } from '@/modules/follows/server/procedures';
import { commentsRouter } from '@/modules/comments/server/procedures';
import { commentReactionsRouter } from '@/modules/comment-reactions/server/procedures';
import { searchRouter } from '@/modules/search/server/procedures';

export const appRouter = createTRPCRouter({
  upload: uploadRouter,
  like: likeRouter,

  createPost: createPostRouter,
  posts: postsRouter,
  studio: studioRouter,
  postViews: postViewsRouter,
  comments: commentsRouter,
  commentReactions: commentReactionsRouter,
  categories: categoriesRouter,
  follows: followsRouter,
  search: searchRouter
});

export type AppRouter = typeof appRouter;
