import { BadRequestException } from '@nestjs/common';

export class FileUnsupportedExtensionException extends BadRequestException {
  constructor(extension: string, expected: string[]) {
    super(
      `Extension "${extension}" is not supported, try one of: ${expected.join(
        ', ',
      )}`,
    );
  }
}
