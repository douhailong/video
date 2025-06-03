import {
  integer,
  pgTable,
  pgEnum,
  timestamp,
  uniqueIndex,
  uuid,
  varchar
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

const timestamps = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull()
};

// export const moodEnum = pgEnum('mood', ['sad', 'ok', 'happy']);

export const users = pgTable(
  'users',
  {
    // mood: moodEnum().default('happy'),
    id: uuid().primaryKey().defaultRandom(),
    clerkId: varchar({ length: 255 }).unique().notNull(),
    name: varchar({ length: 255 }).notNull(),
    imageUrl: varchar({ length: 255 }).notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex('clerk_id_idx').on(t.clerkId)]
);

export const categories = pgTable(
  'categories',
  {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex('name_idx').on(t.name)]
);

export const videos = pgTable('videos', {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  muxStatus: varchar({
    enum: ['waiting', 'preparing', 'ready', 'errored']
  })
    .default('waiting')
    .notNull(),
  muxAssetId: varchar({ length: 255 }).unique(),
  muxUploadId: varchar({ length: 255 }).unique(),
  muxPlaybackId: varchar({ length: 255 }).unique(),
  muxTrackId: varchar({ length: 255 }).unique(),
  muxTrackStatus: varchar({ length: 255 }),
  thumbnailUrl: varchar({ length: 255 }),
  previewUrl: varchar({ length: 255 }),
  duration: integer().default(0).notNull(),
  authorId: uuid()
    .references(() => users.id, {
      onDelete: 'cascade'
    })
    .notNull(),
  categoryId: uuid().references(() => categories.id, { onDelete: 'set null' }),
  ...timestamps
});

// export const videoRelations = relations(videos, ({ one }) => ({
//   users: one(users, {
//     fields: [videos.authorId],
//     references: [users.id],
//   }),
// }));
