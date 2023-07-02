import { ConflictException } from '@nestjs/common';

export class VersionConflictException extends ConflictException {
  constructor(major: number, minor: number) {
    super(`Version ${major}:${minor} already exists, use Patch to update.`);
  }
}
