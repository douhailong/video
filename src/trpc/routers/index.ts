import { createTRPCRouter } from '../init';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { studioRouter } from '@/modules/studio/server/procedures';
import { postsRouter } from '@/modules/posts/server/procedures';
import { postViewsRouter } from '@/modules/post-views/server/procedures';
import { postReactionsRouter } from '@/modules/post-reactions/server/procedures';
import { followsRouter } from '@/modules/follows/server/procedures';
import { commentsRouter } from '@/modules/comments/server/procedures';
import { commentReactionsRouter } from '@/modules/comment-reactions/server/procedures';
import { suggestionsRouter } from '@/modules/suggestions/server/procedures';
import { searchRouter } from '@/modules/search/server/procedures';
import { usersRouter } from '@/modules/users/server/procedures';

export const appRouter = createTRPCRouter({
  posts: postsRouter,
  postViews: postViewsRouter,
  postReactions: postReactionsRouter,
  comments: commentsRouter,
  commentReactions: commentReactionsRouter,
  categories: categoriesRouter,
  follows: followsRouter,

  studio: studioRouter,

  suggestions: suggestionsRouter,
  search: searchRouter,
  users: usersRouter
});

export type AppRouter = typeof appRouter;
