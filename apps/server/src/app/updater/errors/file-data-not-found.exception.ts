import { NotFoundException } from '@nestjs/common';

export class FileDataNotFoundException extends NotFoundException {
  constructor() {
    super({
      statusCode: 404,
      message: `There was no data provided.`,
    });
  }
}
