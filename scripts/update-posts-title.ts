import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { posts } from '../src/db/schema';
import { sql } from 'drizzle-orm';

const pg = postgres(process.env.DATABASE_URL!);
const db = drizzle({ client: pg, logger: true, casing: 'snake_case' });

// 随机中文文案列表（长度约40字符）
const randomTitles = [
  '今天的分享非常精彩，一起来感受这份美好',
  '记录生活中的每一个瞬间，让回忆更加珍贵',
  '这个视频太有趣了，一定要分享给大家看看',
  '日常生活中的小确幸，让人心情愉悦的时光',
  '跟着节奏一起摇摆，感受音乐带来的快乐',
  '美食分享时刻，今天做了一道超级好吃的菜',
  '旅行记录｜发现一个超美的小众打卡地点',
  '宠物日常｜家里的小可爱又在卖萌了',
  '生活小技巧分享，让你的日常更加便利',
  '运动健身打卡，今天的训练效果超棒',
  '周末宅家日常，享受惬意的休息时光',
  '创意手工DIY，动手制作独一无二的作品',
  '读书心得分享，最近看了一本很有意思的书',
  '游戏实况记录，这局操作简直神级发挥',
  '户外探险日记，发现大自然隐藏的美丽',
  '美妆护肤分享，好用的产品推荐给大家',
  '穿搭灵感｜今天的穿搭你们觉得怎么样',
  '探店vlog，发现一家超级好吃的餐厅',
  '学习打卡｜今天也要努力进步一点点',
  '音乐翻唱分享，这首歌真的太好听了',
  '搞笑日常合集，这些瞬间太有意思了',
  '摄影作品展示，记录生活中的美好瞬间',
  '手工制作过程，亲手做一个特别的礼物',
  '健身教程分享，在家也能练出好身材',
  '美食制作过程，今天的菜品大获成功',
  '旅游攻略分享，这个小众景点值得一看',
  '生活记录｜平凡日子里的小确幸时刻',
  '才艺展示时间，为大家表演一个小节目',
  '开箱测评分享，这个东西真的很好用吗',
  '日常碎碎念，聊聊最近发生的小事情',
  '技能教学时间，手把手教大家学会这个',
  '风景实拍分享，这里的风景真的太美了',
  '宠物搞笑时刻，小动物们真的太可爱了',
  '美食探店日记，今天又发现一家宝藏店',
  '生活感悟分享，这些道理越早知道越好',
  '运动日常记录，坚持锻炼的身体变化',
  '创意内容分享，这个想法真的太棒了',
  '日常穿搭分享，简约风格也很时尚',
  '游戏攻略分享，教你如何快速通关',
  '学习心得体会，这些方法真的很有效',
  '摄影技巧教学，用手机也能拍出大片',
  '美食制作教程，跟着做绝对不会失败',
  '旅行见闻分享，这趟旅程收获满满',
  '生活好物推荐，这些小物件很实用',
  '健身打卡记录，每天进步一点点',
  '手工艺作品展示，纯手工制作的过程',
  '户外运动日常，感受大自然的魅力',
  '美食测评时间，这些东西值得买吗',
  '穿搭分享日常，今天的造型很满意',
  '学习进步记录，努力就会有收获',
  '搞笑段子合集，笑一笑十年少',
  '宠物互动日常，和毛孩子玩耍时光',
  '探店美食日记，发现城市里的美食',
  '生活小妙招分享，解决日常小烦恼',
  '运动健身记录，健康生活从现在开始',
  '创意作品展示，脑洞大开的设计',
  '旅游见闻记录，探索未知的风景',
  '日常vlog分享，记录真实的生活',
  '才艺表演时间，展示一下小技能',
  '开箱体验分享，这个东西怎么样',
  '生活随笔记录，平淡中的小幸福'
];

function getRandomTitle(): string {
  return randomTitles[Math.floor(Math.random() * randomTitles.length)];
}

async function updatePostTitles() {
  try {
    // 获取所有posts
    const allPosts = await db.select().from(posts);
    console.log(`找到 ${allPosts.length} 条posts记录`);

    // 逐个更新title
    for (const post of allPosts) {
      const newTitle = getRandomTitle();
      await db.update(posts).set({ title: newTitle }).where(sql`id = ${post.id}`);
      console.log(`更新 ${post.id}: ${newTitle}`);
    }

    console.log('所有posts的title已更新完成!');
    process.exit(0);
  } catch (err) {
    console.error('更新失败:', err);
    process.exit(1);
  }
}

updatePostTitles();