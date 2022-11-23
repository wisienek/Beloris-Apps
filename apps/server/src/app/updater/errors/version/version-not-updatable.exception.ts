import { NotFoundException } from '@nestjs/common';

export class VersionNotUpdatableException extends NotFoundException {
  constructor(major: number, minor: number, isCurrent: boolean) {
    super(
      `Version ${major}:${minor} already had property 'isCurrent: ${isCurrent}'`,
    );
  }
}
