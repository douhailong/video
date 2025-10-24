export function chunkFile(file: File, chunkSize: number) {
  const chunks: Blob[] = [];
  let current = 0;
  while (current < file.size) {
    chunks.push(file.slice(current, current + chunkSize));
    current += chunkSize;
  }
  return chunks;
}

export async function blob2ArrayBuffer(chunks: Blob[]) {
  return await Promise.all(chunks.map((chunk) => chunk.arrayBuffer()));
}
