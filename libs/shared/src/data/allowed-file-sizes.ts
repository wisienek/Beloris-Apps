import { FileType } from '@bella/enums';

export const AllowedFileSizes = {
  [FileType.BUNDLE]: 160 * 1024 * 1024,
} as const;
