import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { database } from '@/config/env';

declare global {
  var db: typeof client | undefined;
}

const pg = postgres(database.url);
const client = drizzle({ client: pg, logger: true, casing: 'snake_case' });
const db = globalThis.db || client;

if (process.env.NODE_ENV !== 'production') globalThis.db = db;

export { db };
