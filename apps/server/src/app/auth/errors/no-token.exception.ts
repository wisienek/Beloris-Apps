import { UnauthorizedException } from '@nestjs/common';

export class NoTokenException extends UnauthorizedException {
  constructor(cookie: string) {
    super({
      message: `No token found in cookie: ${cookie}`,
    });
  }
}
