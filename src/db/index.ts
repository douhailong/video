import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

declare global {
  var db: typeof client | undefined;
}

const pg = postgres(process.env.DATABASE_URL!);
const client = drizzle({ client: pg, logger: true, casing: 'snake_case' });
const db = globalThis.db || client;

if (process.env.NODE_ENV !== 'production') globalThis.db = db;

export { db };
