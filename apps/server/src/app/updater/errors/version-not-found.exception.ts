import { NotFoundException } from '@nestjs/common';

export class VersionNotFoundException extends NotFoundException {
  constructor(major: number, minor: number) {
    super({
      statusCode: 404,
      message: `Version ${major}:${minor} was not found`,
    });
  }
}
