import { minio } from '../src/lib/minio';

const bucketName = 'youtube-clone';

async function initMinio() {
  try {
    const exists = await minio.bucketExists(bucketName);

    if (!exists) {
      await minio.makeBucket(bucketName, 'us-east-1');
      console.log('Bucket created:', bucketName);
    } else {
      console.log('Bucket already exists:', bucketName);
    }
  } catch (err) {
    console.error('MinIO init error:', err);
    process.exit(1);
  }
}

initMinio();
