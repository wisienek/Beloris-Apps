import { NotFoundException } from '@nestjs/common';

export class FileDataNotFoundException extends NotFoundException {
  constructor() {
    super(`Brak danych w requeście!`);
  }
}
