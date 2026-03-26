import { users, posts, likeStatus } from '@/db/schema';

export type PostCardType = {
  onFocusColor?: {
    darkTheme: string;
    lightTheme: string;
  };
  metadata: {
    // title: string;
    // createdAt: Date;
    // likeCount?: number;
    // thumbUrl: string;
    // likeStatus?: (typeof likeStatus.enumValues)[number] | null;
    user: typeof users.$inferSelect;
    data: typeof posts.$inferSelect;
  };
};
