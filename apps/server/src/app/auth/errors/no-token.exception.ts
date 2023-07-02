import { UnauthorizedException } from '@nestjs/common';

export class NoTokenException extends UnauthorizedException {
  constructor(cookie?: string) {
    super(`Brak tokena! ${cookie ? cookie : ''}`);
  }
}
