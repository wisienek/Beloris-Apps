import { createHash } from 'crypto';

export const getFileHash = (buffer: Buffer): string => {
  const fileHash = createHash('sha256');
  fileHash.update(buffer);

  return fileHash.digest('hex');
};
