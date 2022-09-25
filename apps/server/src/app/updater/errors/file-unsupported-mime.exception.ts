import { BadRequestException } from '@nestjs/common';

export class FileUnsupportedMimeException extends BadRequestException {
  constructor(fileMime: string, expected: string[]) {
    super({
      statusCode: 400,
      message: `Mime type "${fileMime}" is not supported, try one of: ${expected.join(
        ', ',
      )}`,
    });
  }
}
