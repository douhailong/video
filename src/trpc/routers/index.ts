import { createTRPCRouter } from '../init';
import { postsRouter } from '@/modules/posts/server/procedures';

import { categoriesRouter } from '@/modules/categories/server/procedures';
import { studioRouter } from '@/modules/studio/server';
import { postViewsRouter } from '@/modules/post-views/server/procedures';
import { postReactionsRouter } from '@/modules/post-reactions/server/procedures';
import { followsRouter } from '@/modules/follows/server/procedures';
import { commentsRouter } from '@/modules/comments/server/procedures';
import { commentReactionsRouter } from '@/modules/comment-reactions/server/procedures';
import { suggestionsRouter } from '@/modules/suggestions/server/procedures';
import { searchRouter } from '@/modules/search/server/procedures';
import { uploadRouter } from '@/modules/upload/server/procedures';

export const appRouter = createTRPCRouter({
  posts: postsRouter,

  studio: studioRouter,
  upload: uploadRouter,
  postViews: postViewsRouter,
  postReactions: postReactionsRouter,
  comments: commentsRouter,
  commentReactions: commentReactionsRouter,
  categories: categoriesRouter,
  follows: followsRouter,
  suggestions: suggestionsRouter,
  search: searchRouter
});

export type AppRouter = typeof appRouter;
