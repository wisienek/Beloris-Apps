import { NotFoundException } from '@nestjs/common';

export class CurrentVersionNotFoundException extends NotFoundException {
  constructor() {
    super(
      `Current version was not found. Contact admins to solve the problem!`,
    );
  }
}
