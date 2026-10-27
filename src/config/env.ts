import { env } from 'process';

// pgsql

export const database = { url: env.DATABASE_URL! };

// s3

export const s3 = {
  endpoint: env.S3_ENDPOINT!,
  accessKey: env.S3_ACCESS_KEY!,
  secretKey: env.S3_SECRET_KEY!,
  region: env.S3_REGION!,
  bucket: env.S3_BUCKET!
};

// redis

export const redis = { url: env.REDIS_URL };
