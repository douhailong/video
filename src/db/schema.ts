import {
  type AnyPgColumn,
  integer,
  pgTable,
  pgEnum,
  timestamp,
  uuid,
  varchar,
  uniqueIndex,
  primaryKey
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

const uuidtamps = uuid().primaryKey().defaultRandom();
const timestamps = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull()
};

export const reactionStatus = pgEnum('reaction_status', ['like', 'dislike']);

export const users = pgTable('user', {
  id: uuidtamps,
  name: varchar().notNull(),
  email: varchar().unique().notNull(),
  emailVerified: timestamp('emailVerified'),
  image: varchar().notNull(),
  ...timestamps
});

export const accounts = pgTable(
  'account',
  {
    userId: uuid('userId')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    type: varchar().$type<AdapterAccountType>().notNull(),
    providerAccountId: varchar('providerAccountId').notNull(),
    provider: varchar().notNull(),
    refresh_token: varchar(),
    access_token: varchar(),
    expires_at: integer(),
    token_type: varchar(),
    scope: varchar(),
    id_token: varchar(),
    session_state: varchar()
  },
  (t) => [primaryKey({ name: 'account_pk', columns: [t.provider, t.providerAccountId] })]
);

export const categories = pgTable(
  'categorie',
  {
    id: uuidtamps,
    name: varchar().unique().notNull(),
    description: varchar({ length: 1000 }).notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex('name_idx').on(t.name)]
);

export const tags = pgTable(
  'tag',
  {
    id: uuidtamps,
    name: varchar().unique().notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex('name_idx').on(t.name)]
);

export const videos = pgTable('video', {
  id: uuidtamps,
  title: varchar().notNull(),
  description: varchar({ length: 1000 }),
  playbackUrl: varchar(),
  thumbnailUrl: varchar(),
  duration: integer().default(0).notNull(),
  status: varchar({ enum: ['waiting', 'uploading', 'preparing', 'ready', 'errored'] })
    .default('waiting')
    .notNull(),
  visibility: varchar({ enum: ['public', 'private'] }).notNull(),
  categoryId: uuid().references(() => categories.id, { onDelete: 'set null' }),
  // tagsId: uuid()
  //   .array()
  //   .references(() => tags.id, { onDelete: 'set null' }),
  authorId: uuid()
    .references(() => users.id, {
      onDelete: 'cascade'
    })
    .notNull(),
  ...timestamps
});

export const videoViews = pgTable(
  'video_view',
  {
    viewerId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    videoId: uuid()
      .references(() => videos.id, { onDelete: 'cascade' })
      .notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'video_view_pk', columns: [t.viewerId, t.videoId] })]
);

export const videoReactions = pgTable(
  'video_reaction',
  {
    viewerId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    videoId: uuid()
      .references(() => videos.id, { onDelete: 'cascade' })
      .notNull(),
    status: reactionStatus().notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'video_reaction_pk', columns: [t.viewerId, t.videoId] })]
);

export const subscriptions = pgTable(
  'subscription',
  {
    subscriberId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    publisherId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'subscription_pk', columns: [t.subscriberId, t.publisherId] })]
);

export const comments = pgTable('comment', {
  id: uuidtamps,
  value: varchar({ length: 1000 }).notNull(),
  authorId: uuid()
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  videoId: uuid()
    .references(() => videos.id, { onDelete: 'cascade' })
    .notNull(),
  parentId: uuid().references((): AnyPgColumn => comments.id, { onDelete: 'cascade' }),
  ...timestamps
});

export const commentReactions = pgTable(
  'comment_reaction',
  {
    viewerId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    commentId: uuid()
      .references(() => comments.id, { onDelete: 'cascade' })
      .notNull(),
    status: reactionStatus().notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'comment_reaction_pk', columns: [t.viewerId, t.commentId] })]
);
