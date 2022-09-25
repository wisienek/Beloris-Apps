import { DataSourceOptions } from 'typeorm';
import { join } from 'path';

import { Backpack, DownloaderFile, GameDCLink, Version } from './entities';
import configuration from '@bella/configuration';
import { EnvEnum } from '@bella/enums';

const getDefaultConfig = (): DataSourceOptions => {
  const defConfig = configuration();

  const dbconfig = defConfig.db;
  const synchronize = defConfig.envType === EnvEnum.DEV;

  return {
    type: 'mariadb',
    synchronize,
    ...dbconfig,
  };
};

export const getConfig = (): DataSourceOptions => {
  return {
    ...getDefaultConfig(),
    entities: [GameDCLink, Backpack, DownloaderFile, Version],
  };
};

export const exportConfig = (): DataSourceOptions => {
  return {
    ...getDefaultConfig(),
    entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '/migrations/**/*{.ts,.js}')],
    // cli: {
    //   migrationsDir: 'libs/backend/database/src/lib/migrations',
    // },
  };
};
