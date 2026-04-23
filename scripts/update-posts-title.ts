import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import { posts, users } from '../src/db/schema';

const pg = postgres(process.env.DATABASE_URL!);
const db = drizzle({ client: pg, logger: true, casing: 'snake_case' });

const DEFAULT_THUMB_URL = '/placeholder.svg';
const DESCRIPTION_PREFIX = '----介绍介绍介绍---';

const randomTitles = [
  '今天的分享非常精彩，一起来感受这份美好',
  '记录生活中的每一个瞬间，让回忆更加珍贵',
  '这个视频太有趣了，一定要分享给大家看看',
  '日常生活中的小确幸，让人心情愉悦的时光',
  '跟着节奏一起摇摆，感受音乐带来的快乐',
  '美食分享时刻，今天做了一道超级好吃的菜',
  '旅行记录，发现一个超美的小众打卡地点',
  '宠物日常，家里的小可爱又在卖萌了',
  '生活小技巧分享，让你的日常更加便利',
  '运动健身打卡，今天的训练效果超棒',
  '周末宅家日常，享受惬意的休息时光',
  '创意手工 DIY，动手制作独一无二的作品'
];

function buildTitle(title: string) {
  return `${title}${title}`;
}

function buildDescription(title: string) {
  return `${DESCRIPTION_PREFIX}${title}`;
}

async function insertPosts() {
  try {
    // const [user] = await db.select({ id: users.id }).from(users).limit(1);

    // if (!user) {
    //   throw new Error('未找到可用用户，请先创建用户数据');
    // }

    const values = randomTitles.map((rawTitle) => {
      const title = buildTitle(rawTitle);

      return {
        title,
        description: buildDescription(title),
        visible: 'public' as const,
        thumbUrl: DEFAULT_THUMB_URL,
        type: 'video' as const,
        userId: '81a691e3-81eb-4cae-97de-88309a4cb118'
      };
    });

    const insertedPosts = await db.insert(posts).values(values).returning({
      id: posts.id,
      title: posts.title
    });

    console.log(`成功插入 ${insertedPosts.length} 条 post 数据`);

    for (const post of insertedPosts) {
      console.log(`已插入 ${post.id}: ${post.title}`);
    }
  } catch (err) {
    console.error('插入失败:', err);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
}

void insertPosts();
