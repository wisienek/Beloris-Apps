import { FileUploadDto } from '@bella/dto';

export const isFileData = (t: unknown): t is FileUploadDto => {
  return !!t && typeof t === 'object' && 'fileAction' in t;
};
