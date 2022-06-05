import { DataSourceOptions } from 'typeorm';
import { join } from 'path';

import configuration from '@bella/configuration';
import { GameDCLink } from './entities';

const getDefaultConfig = (): DataSourceOptions => {
  const defConfig = configuration();
  const dbconfig = defConfig.db;
  const synchronize = defConfig.envType === 'dev';

  return {
    type: 'mariadb',
    synchronize,
    ...dbconfig,
  };
};

export const getConfig = (): DataSourceOptions => {
  return {
    ...getDefaultConfig(),
    entities: [GameDCLink],
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
