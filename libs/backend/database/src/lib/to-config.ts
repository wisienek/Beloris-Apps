import { DataSourceOptions } from 'typeorm';
import { join } from 'path';

import configuration from '@bella/configuration';

const getDefaultConfig = (): DataSourceOptions => {
  const dbconfig = configuration().database;

  return {
    type: 'mysql',
    ...dbconfig,
  };
};

export const getConfig = (): DataSourceOptions => {
  return {
    ...getDefaultConfig(),
    entities: [],
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
