import { UnauthorizedException } from '@nestjs/common';

export class NoTokenException extends UnauthorizedException {
  constructor(cookie: string) {
    super(`No token found in cookie: ${cookie}`);
  }
}
