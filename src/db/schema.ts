import {
  integer,
  pgTable,
  pgEnum,
  timestamp,
  uuid,
  varchar,
  uniqueIndex,
  primaryKey,
  AnyPgColumn
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';

const timestamps = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull()
};

export const users = pgTable(
  'users',
  {
    id: uuid().primaryKey().defaultRandom(),
    clerkId: varchar().unique().notNull(),
    name: varchar().notNull(),
    imageUrl: varchar().notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex('clerk_id_idx').on(t.clerkId)]
);

export const categories = pgTable(
  'categories',
  {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar().notNull(),
    description: varchar().notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex('name_idx').on(t.name)]
);

export const videoVisibilityEnum = pgEnum('video_visibility', ['public', 'private']);
export const muxStatusEnum = pgEnum('video_status', ['waiting', 'preparing', 'ready', 'errored']);

export const videos = pgTable('videos', {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar().notNull(),
  description: varchar(),
  muxStatus: muxStatusEnum().default('waiting').notNull(),
  muxAssetId: varchar().unique(),
  muxUploadId: varchar().unique(),
  muxPlaybackId: varchar().unique(),
  muxTrackId: varchar().unique(),
  muxTrackStatus: varchar(),
  thumbnailUrl: varchar(),
  thumbnailKey: varchar(),
  previewUrl: varchar(),
  previewKey: varchar(),
  duration: integer().default(0).notNull(),
  categoryId: uuid().references(() => categories.id, { onDelete: 'set null' }),
  visibility: videoVisibilityEnum().default('private').notNull(),
  authorId: uuid()
    .references(() => users.id, {
      onDelete: 'cascade'
    })
    .notNull(),
  ...timestamps
});

export const videoSelectSchema = createSelectSchema(videos);
export const videoInsertSchema = createInsertSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);

export const videoViews = pgTable(
  'video_views',
  {
    authorId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    videoId: uuid()
      .references(() => videos.id, { onDelete: 'cascade' })
      .notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'video_views_pk', columns: [t.authorId, t.videoId] })]
);

export const videoReactionEnum = pgEnum('video_reaction', ['like', 'dislike']);

export const videoReactions = pgTable(
  'video_reactions',
  {
    authorId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    videoId: uuid()
      .references(() => videos.id, { onDelete: 'cascade' })
      .notNull(),
    status: videoReactionEnum().notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'video_reactions_pk', columns: [t.authorId, t.videoId] })]
);

export const subscriptions = pgTable(
  'subscriptions',
  {
    subscriberId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    publisherId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'subscriptions_pk', columns: [t.subscriberId, t.publisherId] })]
);

export const comments = pgTable('comments', {
  id: uuid().primaryKey().defaultRandom(),
  parentId: uuid().references((): AnyPgColumn => comments.id, { onDelete: 'cascade' }),
  authorId: uuid()
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  videoId: uuid()
    .references(() => videos.id, { onDelete: 'cascade' })
    .notNull(),
  value: varchar({ length: 512 }).notNull(),
  ...timestamps
});

export const commentReactionEnum = pgEnum('comment_reaction', ['like', 'dislike']);

export const commentReactions = pgTable(
  'comment_reactions',
  {
    authorId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    commentId: uuid()
      .references(() => comments.id, { onDelete: 'cascade' })
      .notNull(),
    status: commentReactionEnum().notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'comment_reactions_pk', columns: [t.authorId, t.commentId] })]
);

export const commentSelectSchema = createSelectSchema(comments);
export const commentInsertSchema = createInsertSchema(comments);
export const commentUpdateSchema = createUpdateSchema(comments);
