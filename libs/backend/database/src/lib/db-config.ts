import { DataSourceOptions } from 'typeorm';
import { join } from 'path';

import { Backpack, DownloaderFile, GameDCLink, Version } from './entities';
import { DatabaseConfig, getStaticConfig, ProjectConfig } from '@bella/config';

const getDefaultConfig = (): DataSourceOptions => {
  const config = getStaticConfig(DatabaseConfig);
  const projectConfig = getStaticConfig(ProjectConfig);

  const synchronize = projectConfig.isDev();
  return {
    type: 'mariadb',
    synchronize,
    port: config.port,
    database: config.db,
    username: config.user,
    password: config.password,
    host: config.host,
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
