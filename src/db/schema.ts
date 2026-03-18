import {
  type AnyPgColumn,
  integer,
  pgTable,
  pgEnum,
  timestamp,
  uuid,
  varchar,
  primaryKey
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

const timestamps = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
};

export const likeStatus = pgEnum('like_status', ['like', 'dislike']);
export const visibleStatus = pgEnum('visible_status', ['public', 'private']);

export const postType = pgEnum('post_type', ['video', 'picture']);

export const users = pgTable('user', {
  id: uuid().primaryKey().defaultRandom(),
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
    refreshToken: varchar(),
    accessToken: varchar(),
    expiresAt: integer(),
    tokenType: varchar(),
    scope: varchar(),
    idToken: varchar(),
    sessionState: varchar()
  },
  (t) => [primaryKey({ name: 'account_pk', columns: [t.provider, t.providerAccountId] })]
);

export const posts = pgTable('post', {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar().notNull(),
  description: varchar().notNull(),
  visible: visibleStatus().notNull(),
  coverUrl: varchar().notNull(),
  type: postType().notNull(),
  userId: uuid()
    .references(() => users.id, {
      onDelete: 'cascade'
    })
    .notNull(),
  ...timestamps
});

export const videos = pgTable('video', {
  id: uuid().primaryKey().defaultRandom(),
  playbackUrl: varchar().notNull(),
  duration: integer().notNull(),
  // resolution: varchar(), 分辨率，格式怎么写？
  status: varchar({ enum: ['waiting', 'preparing', 'ready', 'errored'] }).notNull(),
  postId: uuid()
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull()
});

export const pictures = pgTable('picture', {
  id: uuid().primaryKey().defaultRandom(),
  pictureUrl: varchar().notNull(),
  postId: uuid()
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull()
});

export const postViews = pgTable(
  'post_view',
  {
    userId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    postId: uuid()
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'post_view_pk', columns: [t.userId, t.postId] })]
);

export const postLikes = pgTable(
  'post_like',
  {
    userId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    postId: uuid()
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    status: likeStatus().notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'post_like_pk', columns: [t.userId, t.postId] })]
);

export const postCollections = pgTable(
  'post_collection',
  {
    userId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    postId: uuid()
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'post_collection_pk', columns: [t.userId, t.postId] })]
);

export const comments = pgTable('comment', {
  id: uuid().primaryKey().defaultRandom(),
  text: varchar().notNull(),
  parentId: uuid().references((): AnyPgColumn => comments.id, { onDelete: 'cascade' }),
  feedbackId: uuid().references((): AnyPgColumn => comments.id, {
    onDelete: 'cascade'
  }),
  userId: uuid()
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  postId: uuid()
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  ...timestamps
});

export const commentLikes = pgTable(
  'comment_like',
  {
    userId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    commentId: uuid()
      .references(() => comments.id, { onDelete: 'cascade' })
      .notNull(),
    status: likeStatus().notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'comment_feedback_pk', columns: [t.userId, t.commentId] })]
);

// export const categories = pgTable('categorie', {
//   id: uuid().primaryKey().defaultRandom(),
//   name: varchar().unique().notNull(),
//   description: varchar({ length: 1000 }).notNull(),
//   ...timestamps
// });

// export const tags = pgTable('tag', {
//   id: uuid().primaryKey().defaultRandom(),
//   name: varchar().unique().notNull(),
//   description: varchar({ length: 1000 }).notNull(),
//   ...timestamps
// });

// export const postTags = pgTable(
//   'post_tags',
//   {
//     postId: uuid()
//       .notNull()
//       .references(() => posts.id, { onDelete: 'cascade' }),
//     tagId: uuid()
//       .notNull()
//       .references(() => tags.id, { onDelete: 'cascade' }),
//     ...timestamps
//   },
//   (t) => [primaryKey({ name: 'post_tag_pk', columns: [t.tagId, t.postId] })]
// );

// export const favorites = pgTable('favorite', {
//   id: uuid().primaryKey().defaultRandom(),
//   name: varchar().notNull(),
//   description: varchar().notNull(),
//   ...timestamps
// });

// export const postFavorites = pgTable(
//   'post_favorite',
//   {
//     favoriteId: uuid()
//       .notNull()
//       .references(() => favorites.id, { onDelete: 'cascade' }),
//     postId: uuid()
//       .notNull()
//       .references(() => posts.id, { onDelete: 'cascade' })
//   },
//   (t) => [primaryKey({ name: 'post_favorite_pk', columns: [t.favoriteId, t.postId] })]
// );

// export const subscribes = pgTable(
//   'subscribe',
//   {
//     subscriberId: uuid()
//       .references(() => users.id, { onDelete: 'cascade' })
//       .notNull(),
//     publisherId: uuid()
//       .references(() => users.id, { onDelete: 'cascade' })
//       .notNull(),
//     ...timestamps
//   },
//   (t) => [primaryKey({ name: 'subscribe_pk', columns: [t.subscriberId, t.publisherId] })]
// );

// export const messages = pgTable('message', {
//   id: uuid().primaryKey().defaultRandom(),
//   content: varchar({ length: 1000 }),
//   image: varchar(),
//   authorId: uuid()
//     .references(() => users.id, { onDelete: 'cascade' })
//     .notNull(),
//   conversationId: uuid()
//     .references(() => conversations.id, { onDelete: 'cascade' })
//     .notNull(),
//   ...timestamps
// });

// export const conversations = pgTable('conversation', {
//   id: uuid().primaryKey().defaultRandom(),
//   name: varchar(),
//   isGroup: boolean(),
//   memberId: uuid()
//     .array()
//     .references(() => users.id, { onDelete: 'cascade' })
//     .notNull(),
//   ...timestamps
// });
