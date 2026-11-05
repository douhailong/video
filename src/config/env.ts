import { env } from 'process';

// pgsql

export const database = { url: env.DATABASE_URL! };

// redis

export const redis = { url: env.REDIS_URL };
