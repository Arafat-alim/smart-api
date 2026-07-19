import archiver from 'archiver';

export function buildZip(files: Record<string, string>): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const chunks: Buffer[] = [];

    archive.on('data', (chunk: Buffer) => chunks.push(chunk));
    archive.on('error', (err) => reject(err));
    archive.on('end', () => resolve(Buffer.concat(chunks)));

    for (const [filePath, content] of Object.entries(files)) {
      archive.append(content, { name: filePath });
    }

    archive.finalize();
  });
}
