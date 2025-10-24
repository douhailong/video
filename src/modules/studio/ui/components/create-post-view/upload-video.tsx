'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Dropzone from 'react-dropzone';
import { toast } from 'sonner';
import { UploadCloud } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { PromisePool } from '@/lib/utils/promise-pool';
import { chunkFile, blob2ArrayBuffer } from '@/lib/utils/chunk-file';
import { Button } from '@/components/ui/button';

import { useDraft } from '@/modules/studio/hooks/use-draft';
import type { OutputMessage } from './worker';

type UploadQueue = {
  chunks: Blob[];
  uploadedIndex: number[];
  filehash: string;
  filename: string;
};

const UploadVideo = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hashProgress, setHashProgress] = useState(0);

  const router = useRouter();
  const { setDraft } = useDraft();

  const validateChunks = trpc.upload.validateChunks.useMutation();
  const uploadChunk = trpc.upload.uploadChunk.useMutation();
  const mergeChunks = trpc.upload.mergeChunks.useMutation();

  const uploadSuccess = async (title: string) => {
    setUploadProgress(100);
    toast.success('上传成功');
    setDraft({
      title,
      description: '暂无介绍',
      type: 'video',
      video: {}
    });
    router.push(`/studio/create/video`);
  };

  async function chunkUpload(file: File) {
    const chunks = chunkFile(file, 1024 * 1024 * 5);
    const buffers = await blob2ArrayBuffer(chunks);
    const worker = new Worker(new URL('./worker.ts', import.meta.url), {
      type: 'module'
    });

    function createUploadQueue(payload: UploadQueue, fn: typeof uploadChunk.mutateAsync) {
      const { chunks, uploadedIndex, filehash, filename } = payload;
      const total = chunks.length;
      const uploadQueue = [];

      for (let i = 0; i < chunks.length; i++) {
        if (!uploadedIndex.includes(i)) {
          uploadQueue.push(() => {
            const formData = new FormData();
            formData.append('chunk', chunks[i]);
            formData.append('chunkTotal', String(total));
            formData.append('chunkIndex', String(i));
            formData.append('filehash', filehash);
            formData.append('filename', filename);
            return fn(formData);
          });
        }
      }
      return uploadQueue;
    }

    worker.onmessage = async (e: MessageEvent<OutputMessage>) => {
      const { filehash, progress } = e.data;
      const filename = file.name;

      setHashProgress(progress);

      if (filehash) {
        const chunksStatus = await validateChunks.mutateAsync({ filehash });

        if (chunksStatus.exists) {
          return uploadSuccess(filename);
        }

        if (chunksStatus.uploadedIndex.length === chunks.length) {
          await mergeChunks.mutateAsync({
            filehash,
            filename,
            chunkTotal: chunks.length
          });
          return uploadSuccess(filename);
        }

        const uploadQueue = createUploadQueue(
          {
            chunks,
            filehash,
            filename,
            uploadedIndex: chunksStatus.uploadedIndex
          },
          uploadChunk.mutateAsync
        );
        const pool = new PromisePool(uploadQueue);
        let uploadedCount = 0;

        pool
          .exec(({ status, index }) => {
            if (status === 'successful') {
              uploadedCount++;
              const progress = Math.floor((uploadedCount / uploadQueue.length) * 100);
              return setUploadProgress(progress);
            }
            pool.add(uploadQueue[index]);
          })
          .then(() => {
            uploadSuccess(filename);
            worker.terminate();
          });
      }
    };
    worker.postMessage({ buffers });
  }

  function upload() {}

  return (
    <Dropzone
      accept={{ video: ['.mp4', '.webm'] }}
      multiple={false}
      onDrop={([file]) => {
        chunkUpload(file);
        // file.size > 1024 * 1024 * 50 ? chunkUpload(file) : upload();
      }}
      disabled={!!hashProgress || !!uploadProgress}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className='flex cursor-pointer flex-col items-center gap-y-3 border border-dashed border-gray-300 py-12'
        >
          <UploadCloud className='text-muted-foreground size-6' />
          <p className='text-muted-foreground text-xs'>
            点击上传 或直接将视频文件拖入此区域
          </p>
          <Button className='w-32'>{buttonText(uploadProgress, hashProgress)}</Button>
          <input {...getInputProps()} />
        </div>
      )}
    </Dropzone>
  );
};

export default UploadVideo;

function buttonText(uploadProgress: number, hashProgress: number) {
  if (uploadProgress) {
    return uploadProgress === 100 ? '上传成功' : `上传中 ${uploadProgress}%`;
  }

  if (hashProgress) {
    return hashProgress === 100 ? '解析完成' : `解析中 ${hashProgress}%`;
  }

  return '上传视频';
}
