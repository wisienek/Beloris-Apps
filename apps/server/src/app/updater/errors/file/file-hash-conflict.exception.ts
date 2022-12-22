import { ConflictException } from '@nestjs/common';

export class FileHashConflictException extends ConflictException {
  constructor(expectedHash?: string, gotHash?: string) {
    super(
      `Hash for file is different then it should be! ${
        expectedHash && gotHash ? `(e: ${expectedHash}, g: ${gotHash})` : ''
      }`,
    );
  }
}
