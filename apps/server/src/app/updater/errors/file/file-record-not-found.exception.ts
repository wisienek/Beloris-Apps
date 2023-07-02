import { NotFoundException } from '@nestjs/common';

export class FileRecordNotFoundException extends NotFoundException {
  constructor(uuid: string) {
    super(`Record with uuid "${uuid}" for file was not found`);
  }
}
