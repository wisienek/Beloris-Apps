import { ConflictException } from '@nestjs/common';
import { FileAction } from '@bella/enums';

export class FileHashConflictException extends ConflictException {
  constructor(
    major: number,
    minor: number,
    savePath: string,
    fileAction: FileAction,
  ) {
    super({
      statusCode: 400,
      message: `No data was changed (same hash), chose different file. ${major}:${minor}, ${savePath}, ${fileAction}`,
    });
  }
}
