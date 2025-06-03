import { db } from '@/db';
import { categories } from '@/db/schema';

const categoryNames = [
  'Cars and vehicles',
  'Comedy',
  'Education',
  'Gaming',
  'Entertainment',
  'Film and animation',
  'How-to and style',
  'Music',
  'News and politics',
  'People and blogs',
  'Pets and animals',
  'Science and technology',
  'Sports',
  'Travel and events'
];
const values = categoryNames.map((name) => ({
  name,
  description: `Videos related to ${name.toLowerCase()}`
}));

async function main() {
  await db.insert(categories).values(values);

  try {
  } catch (error) {
    console.error(`Error init categories: `, error);
    process.exit(1);
  }
}

main();

export const GET = () => {
  return new Response('??????');
};
