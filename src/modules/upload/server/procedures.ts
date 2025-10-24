import fs from 'fs';
import path from 'path';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

import { procedure, createTRPCRouter } from '@/trpc/init';

const uploadChunkInput = zfd.formData({
  chunk: zfd.file(),
  chunkTotal: z.string(),
  chunkIndex: z.string(),
  filehash: z.string(),
  filename: z.string(),
  autoMerge: z.boolean().nullish()
});

const mergeChunksInput = z.object({
  filehash: z.string(),
  filename: z.string(),
  chunkTotal: z.number()
});

function getChunkDir(pathname: string) {
  return path.join(process.cwd(), 'uploads', 'chunks', pathname);
}

function getCompletedDir() {
  return path.join(process.cwd(), 'uploads', 'completed');
}

async function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
}

async function mergeChunks({
  chunkTotal,
  filehash,
  filename
}: z.infer<typeof mergeChunksInput>) {
  const chunkDir = getChunkDir(filehash);

  if (!fs.existsSync(chunkDir)) {
    throw new TRPCError({ code: 'NOT_FOUND' });
  }

  const chunks = await fs.promises.readdir(chunkDir);

  if (chunks.length !== chunkTotal) {
    throw new TRPCError({ code: 'BAD_REQUEST' });
  }

  const completedDir = getCompletedDir();
  const outputPath = path.join(completedDir, filehash);

  await ensureDir(completedDir);
  await new Promise(async (resolve, reject) => {
    const writeStream = fs.createWriteStream(outputPath);
    const chunksPath = chunks.sort(
      (a, b) => +a.replace(`${filehash}.`, '') - +b.replace(`${filehash}.`, '')
    );

    writeStream.on('finish', () => resolve(1));
    writeStream.on('error', reject);

    for (let i = 0; i < chunksPath.length; i++) {
      const chunkPath = chunksPath[i];
      const chunkData = await fs.promises.readFile(path.join(chunkDir, chunkPath));
      writeStream.write(chunkData);
    }
    writeStream.end();
  });

  await fs.promises.rmdir(chunkDir, { recursive: true });

  return { filename };
}

export const uploadRouter = createTRPCRouter({
  validateChunks: procedure
    .input(z.object({ filehash: z.string() }))
    .mutation(async ({ input: { filehash } }) => {
      const chunkDir = getChunkDir(filehash);
      const completedFile = path.join(getCompletedDir(), filehash);
      const uploadedIndex: number[] = [];

      if (fs.existsSync(completedFile)) {
        return { exists: true, uploadedIndex };
      }

      if (fs.existsSync(chunkDir)) {
        const chunks = await fs.promises.readdir(chunkDir);
        for (let i = 0; i < chunks.length; i++) {
          uploadedIndex.push(+chunks[i].replace(`${filehash}.`, ''));
        }
      }

      return { exists: false, uploadedIndex };
    }),
  mergeChunks: procedure.input(mergeChunksInput).mutation(async ({ input }) => {
    return await mergeChunks(input);
  }),
  uploadChunk: procedure.input(uploadChunkInput).mutation(async ({ input }) => {
    const { chunk, filehash, filename, autoMerge = true } = input;
    const chunkTotal = +input.chunkTotal;
    const chunkIndex = +input.chunkIndex;

    const chunkDir = getChunkDir(filehash);

    await ensureDir(chunkDir);
    await fs.promises.writeFile(
      path.join(chunkDir, `${filehash}.${chunkIndex}`),
      Buffer.from(await chunk.arrayBuffer())
    );

    const chunks = await fs.promises.readdir(chunkDir);

    if (chunks.length === chunkTotal && autoMerge) {
      return await mergeChunks({ filehash, filename, chunkTotal });
    }
    return { chunkIndex };
  }),
  upload: procedure.mutation(async () => {})
});
