import { Client } from 'minio';

export const minio = new Client({
  endPoint: process.env.MINIO_HOST!,
  port: process.env.MINIO_PORT as any as number,
  useSSL: false, // 如果使用 HTTPS 设为 true
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});
