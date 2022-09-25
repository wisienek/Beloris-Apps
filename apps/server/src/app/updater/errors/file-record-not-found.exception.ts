import { NotFoundException } from '@nestjs/common';

export class FileRecordNotFoundException extends NotFoundException {
  constructor(uuid: string) {
    super({
      statusCode: 400,
      message: `Record with uuid "${uuid}" for file was not found`,
    });
  }
}
