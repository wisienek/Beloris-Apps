import { NotFoundException } from '@nestjs/common';

export class VersionNotFoundException extends NotFoundException {
  constructor(major: number, minor: number) {
    super(`Version ${major}:${minor} was not found`);
  }
}
