import {
  type AnyPgColumn,
  integer,
  pgTable,
  pgEnum,
  timestamp,
  uuid,
  varchar,
  primaryKey,
  boolean,
  bigint
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

const timestamps = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
};

export const likeStatusEnum = pgEnum('like_status', ['like', 'dislike']);

export const visibilityEnum = pgEnum('visibility', ['public', 'private']);

export const mediaTypeEnum = pgEnum('media_type', ['video', 'picture']);
export const mediaStatusEnum = pgEnum('media_status', [
  'created',
  'uploading',
  'preparing',
  'ready',
  'errored'
]);

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
  userId: uuid()
    .references(() => users.id, {
      onDelete: 'cascade'
    })
    .notNull(),
  title: varchar().notNull(),
  description: varchar(),
  type: mediaTypeEnum().notNull(),
  visibility: visibilityEnum().notNull().default('private'),
  thumbUrl: varchar(),
  publishedAt: timestamp(),
  ...timestamps
});

export const videos = pgTable('video', {
  id: uuid().primaryKey().defaultRandom(),
  sourceId: varchar(),
  playbackId: varchar(),
  // providerJobId: varchar().unique(),
  duration: integer(),
  name: varchar().notNull(),
  size: bigint({ mode: 'number' }).notNull(),
  width: integer(),
  height: integer(),
  mimeType: varchar().notNull(),
  status: mediaStatusEnum().notNull().default('created'),
  postId: uuid()
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  ...timestamp
});

export const pictures = pgTable('picture', {
  id: uuid().primaryKey().defaultRandom(),
  postId: uuid()
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  playbackKey: varchar().notNull(),
  size: bigint({ mode: 'number' }),
  width: integer(),
  height: integer(),
  mimeType: varchar(),
  ...timestamp
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
    watchTime: integer().default(0).notNull(),
    deleted: boolean(),
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
    status: likeStatusEnum().notNull(),
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
  repliedId: uuid().references((): AnyPgColumn => comments.id, {
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
    status: likeStatusEnum().notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'comment_like_pk', columns: [t.userId, t.commentId] })]
);

export const follows = pgTable(
  'follows',
  {
    followerId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    followedId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'follows_pk', columns: [t.followerId, t.followedId] })]
);

export const playlists = pgTable('playlist', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar().notNull(),
  visibility: visibilityEnum().notNull(),
  userId: uuid()
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  ...timestamps
});

export const playlistPosts = pgTable(
  'playlist_post',
  {
    playlistId: uuid()
      .references(() => playlists.id, { onDelete: 'cascade' })
      .notNull(),
    postId: uuid()
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ name: 'playlist_post_pk', columns: [t.playlistId, t.postId] })]
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
