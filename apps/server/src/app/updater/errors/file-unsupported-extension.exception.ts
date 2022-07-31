import { BadRequestException } from '@nestjs/common';

export class FileUnsupportedExtensionException extends BadRequestException {
  constructor(extension: string, expected: string[]) {
    super({
      statusCode: 400,
      message: `Extension "${extension}" is not supported, try one of: ${expected.join(
        ', ',
      )}`,
    });
  }
}
