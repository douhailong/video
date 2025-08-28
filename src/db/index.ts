import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const connect = drizzle({ client, casing: 'snake_case', logger: true });

declare global {
  var db: typeof connect | undefined;
}

const db = globalThis.db || connect;

if (process.env.NODE_ENV !== 'production') globalThis.db = db;

export { db };
