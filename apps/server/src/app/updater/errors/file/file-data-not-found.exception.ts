import { NotFoundException } from '@nestjs/common';

export class FileDataNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Nie znaleziono danych o pliku o id: ${id}`);
  }
}
