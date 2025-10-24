import SparkMD5 from 'spark-md5';

export type InputMessage = {
  buffers: ArrayBuffer[];
};

export type OutputMessage = {
  progress: number;
  filehash?: string;
};

self.onmessage = (e: MessageEvent<InputMessage>) => {
  const { buffers } = e.data;

  const total = buffers.length;
  const spark = new SparkMD5.ArrayBuffer();
  let current = 0;
  let prevProgress = 0;

  while (current < total) {
    const buffer = buffers[current];
    const currentProgress = Math.floor((current / total) * 100);

    spark.append(buffer);
    if (currentProgress - prevProgress >= 3) {
      self.postMessage({ progress: currentProgress });
      prevProgress = currentProgress;
    }
    current++;
  }

  const filehash = spark.end();
  self.postMessage({ progress: 100, filehash });
};
