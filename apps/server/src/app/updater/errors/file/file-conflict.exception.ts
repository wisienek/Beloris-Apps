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
      `Plik dla wersji ${major}:${minor} i zapisie ${savePath} [${fileAction}] już istnieje, użyj patczka!`,
    );
  }
}
