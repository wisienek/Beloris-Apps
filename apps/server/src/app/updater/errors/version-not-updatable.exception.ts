import { NotFoundException } from '@nestjs/common';

export class VersionNotUpdatableException extends NotFoundException {
  constructor(major: number, minor: number, isCurrent: boolean) {
    super({
      statusCode: 400,
      message: `Version ${major}:${minor} already had property 'isCurrent: ${isCurrent}'`,
    });
  }
}
