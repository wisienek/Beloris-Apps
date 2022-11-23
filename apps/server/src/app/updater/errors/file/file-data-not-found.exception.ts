import { NotFoundException } from '@nestjs/common';

export class FileDataNotFoundException extends NotFoundException {
  constructor() {
    super(`There was no data provided.`);
  }
}
