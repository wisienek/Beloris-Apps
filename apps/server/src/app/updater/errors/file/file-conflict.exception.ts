import { ConflictException } from '@nestjs/common';
import { FileAction } from '@bella/enums';

export class FileConflictException extends ConflictException {
  constructor(
    major: number,
    minor: number,
    savePath: string,
    fileAction: FileAction,
  ) {
    super(
      `file for version ${major}:${minor} and savePath ${savePath} [${fileAction}] already exists, use Patch`,
    );
  }
}
