import { NotFoundException } from '@nestjs/common';

export class FileNotFoundException extends NotFoundException {
  constructor() {
    super({
      statusCode: 404,
      message: `No file was found`,
    });
  }
}
