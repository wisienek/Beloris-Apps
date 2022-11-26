import { FileType } from '@bella/enums';

export const AllowedFileSizes = {
  [FileType.BUNDLE]: 80_000_000,
} as const;
