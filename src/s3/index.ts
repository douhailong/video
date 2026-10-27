import { S3Client } from '@aws-sdk/client-s3';
import { s3 as s3Env } from '@/config/env';

export const s3 = new S3Client({
  endpoint: s3Env.endpoint,
  region: s3Env.region,
  credentials: {
    accessKeyId: s3Env.accessKey,
    secretAccessKey: s3Env.secretKey
  },
  forcePathStyle: true
});
