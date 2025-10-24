import { and, desc, eq, lt, or, ilike, getTableColumns, count, ne } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { db } from '@/db';
import { comments, videos, postLikes, postViews, posts, pictures } from '@/db/schema';
import { procedure, createTRPCRouter } from '@/trpc/init';
import { postSchema } from '@/lib/zod';

export const postsRouter = createTRPCRouter({
  create: procedure.input(postSchema).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;

    const post = (async function () {
      if (input.type === 'video') {
        const { video, ...basePost } = input;

        const post = await db.transaction(async (tx) => {
          const [createdPost] = await tx
            .insert(posts)
            .values({
              ...basePost,
              userId
            })
            .returning();

          const [createdVideo] = await tx
            .insert(videos)
            .values({
              ...video,
              postId: createdPost.id
            })
            .returning();

          return { ...createdPost, video: createdVideo };
        });

        return post;
      }

      if (input.type === 'picture') {
        const { picture, ...basePost } = input;

        const post = await db.transaction(async (tx) => {
          const [createdPost] = await tx
            .insert(posts)
            .values({
              ...basePost,
              userId
            })
            .returning();

          const [createdPicture] = await tx
            .insert(pictures)
            .values({
              ...picture,
              postId: createdPost.id
            })
            .returning();

          return { ...createdPost, picture: createdPicture };
        });

        return post;
      }
    })();

    if (!post) {
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }

    return post;
  }),
  update: procedure
    .input(postSchema.and(z.object({ id: z.uuid() })))
    .mutation(async ({ ctx, input }) => {
      const { id, ...restInput } = input;
      const { userId } = ctx;

      const [updatedPost] = await db
        .update(posts)
        .set({
          ...restInput,
          updatedAt: new Date()
        })
        .where(and(eq(posts.id, id!), eq(posts.userId, userId)))
        .returning();

      if (!updatedPost) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return updatedPost;
    }),
  remove: procedure.input(z.object({ id: z.uuid() })).mutation(async ({ ctx, input }) => {
    const { id } = input;
    const { userId } = ctx;

    const [removedPost] = await db
      .delete(posts)
      .where(and(eq(posts.userId, userId), eq(posts.id, id)))
      .returning();

    if (!removedPost) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return removedPost;
  }),
  getOne: procedure
    .input(z.object({ id: z.uuid(), type: z.enum(['video', 'picture']) }))
    .query(async ({ ctx, input }) => {
      const { id, type } = input;
      const { userId } = ctx;

      const subTable = type === 'video' ? videos : pictures;

      const [post] = await db
        .select({ ...getTableColumns(posts), video: videos })
        .from(posts)
        .innerJoin(subTable, eq(subTable.postId, id))
        .where(and(eq(posts.id, id), eq(posts.userId, userId)));

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return post;
    }),
  getMany: procedure
    .input(
      z.object({
        query: z.string().nullish(),
        cursor: z.object({ id: z.uuid(), updateAt: z.date() }).nullish(),
        limit: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit, query } = input;
      const { userId } = ctx;

      const likeCounts = db.$with('like_count').as(
        db
          .select({
            postId: postLikes.postId,
            count: count(postLikes.postId).as('likeCount')
          })
          .from(postLikes)
          .where(eq(postLikes.status, 'like'))
          .groupBy(postLikes.postId)
      );

      const commentCounts = db.$with('comment_count').as(
        db
          .select({
            postId: comments.postId,
            count: count(comments.id).as('commentCount')
          })
          .from(comments)
          .groupBy(comments.postId)
      );

      const viewCounts = db.$with('view_count').as(
        db
          .select({
            postId: postViews.postId,
            count: count(postViews.postId).as('viewCount')
          })
          .from(postViews)
          .groupBy(postViews.postId)
      );

      const [data, total] = await Promise.all([
        db
          .with(commentCounts, likeCounts, viewCounts)
          .select({
            ...getTableColumns(posts),
            commentCount: commentCounts.count,
            viewCount: viewCounts.count,
            likeCount: likeCounts.count
          })
          .from(posts)
          .leftJoin(commentCounts, eq(commentCounts.postId, posts.id))
          .leftJoin(viewCounts, eq(viewCounts.postId, posts.id))
          .leftJoin(likeCounts, eq(likeCounts.postId, posts.id))
          .where(
            and(
              eq(posts.userId, userId),
              query ? ilike(posts.title, `%${query}%`) : undefined,
              cursor
                ? or(
                    lt(posts.updatedAt, cursor.updateAt),
                    and(eq(posts.updatedAt, cursor.updateAt), lt(posts.id, cursor.id))
                  )
                : undefined
            )
          )
          .orderBy(desc(posts.updatedAt), desc(posts.id))
          .limit(limit + 1),
        db.$count(
          posts,
          and(
            eq(posts.userId, userId),
            query ? ilike(posts.title, `%${query}%`) : undefined
          )
        )
      ]);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.id, updateAt: lastItem.updatedAt }
        : null;

      return { items, nextCursor, total };
    })
});
