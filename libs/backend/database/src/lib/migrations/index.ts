import { MixedList } from 'typeorm';
import { BaseEntities1671740955384 } from './1671740955384-BaseEntities';
import { backpacks1671803321285 } from './1671803321285-backpacks';

export const migrations: MixedList<string | Function> = [
  BaseEntities1671740955384,
  backpacks1671803321285
];
