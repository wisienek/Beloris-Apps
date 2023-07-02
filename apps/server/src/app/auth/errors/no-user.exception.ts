import { UnauthorizedException } from '@nestjs/common';

export class NoUserException extends UnauthorizedException {
  constructor(state: string) {
    super(
      `Token with state ${state} is either expired or couldn't find user signed in to it.`,
    );
  }
}
