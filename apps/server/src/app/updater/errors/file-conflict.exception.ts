import { ConflictException } from '@nestjs/common';
import { FileAction } from '@bella/shared';

export class FileConflictException extends ConflictException {
  constructor(
    major: number,
    minor: number,
    savePath: string,
    fileAction: FileAction,
  ) {
    super({
      statusCode: 400,
      message: `file for version ${major}:${minor} and savePath ${savePath} [${fileAction}] already exists, use Patch`,
    });
  }
}
