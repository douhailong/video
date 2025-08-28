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
  role: varchar({ enum: ['root', 'admin', 'user'] }).default('user'),
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
  (t) => [uniqueIndex('categorie_idx').on(t.name)]
);

export const tags = pgTable(
  'tag',
  {
    id: uuidtamps,
    name: varchar().unique().notNull(),
    description: varchar({ length: 1000 }).notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex('tag_idx').on(t.name)]
);

export const posts = pgTable('post', {
  id: uuidtamps,
  title: varchar().notNull(),
  description: varchar({ length: 1000 }).notNull(),
  playbackUrl: varchar(),
  thumbUrl: varchar(),
  duration: integer().default(0).notNull(),
  status: varchar({ enum: ['waiting', 'preparing', 'ready', 'errored'] })
    .default('waiting')
    .notNull(),
  visible: varchar({ enum: ['public', 'private'] }).notNull(),
  categoryId: uuid().references(() => categories.id, { onDelete: 'set null' }),
  authorId: uuid()
    .references(() => users.id, {
      onDelete: 'cascade'
    })
    .notNull(),
  ...timestamps
});

export const postViews = pgTable(
  'post_view',
  {
    viewerId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    postId: uuid()
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'post_view_pk', columns: [t.viewerId, t.postId] })]
);

export const postReactions = pgTable(
  'post_reaction',
  {
    reactorId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    postId: uuid()
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    status: reactionStatus().notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'post_reaction_pk', columns: [t.reactorId, t.postId] })]
);

export const comments = pgTable('comment', {
  id: uuidtamps,
  content: varchar({ length: 1000 }).notNull(),
  parentId: uuid().references((): AnyPgColumn => comments.id, { onDelete: 'cascade' }),
  authorId: uuid()
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  postId: uuid()
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  ...timestamps
});

export const commentReactions = pgTable(
  'comment_reaction',
  {
    reactorId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    commentId: uuid()
      .references(() => comments.id, { onDelete: 'cascade' })
      .notNull(),
    status: reactionStatus().notNull(),
    ...timestamps
  },
  (t) => [
    primaryKey({ name: 'comment_reaction_pk', columns: [t.reactorId, t.commentId] })
  ]
);

export const follows = pgTable(
  'follow',
  {
    followerId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    followingId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'follow_pk', columns: [t.followerId, t.followingId] })]
);
