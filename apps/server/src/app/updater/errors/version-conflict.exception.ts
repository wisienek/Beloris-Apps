import { ConflictException } from '@nestjs/common';

export class VersionConflictException extends ConflictException {
  constructor(major: number, minor: number) {
    super({
      statusCode: 400,
      message: `Version ${major}:${minor} already exists, use Patch to update.`,
    });
  }
}
