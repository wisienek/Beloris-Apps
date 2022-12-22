import { DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { DatabaseConfig, getStaticConfig } from '@bella/config';
import { Backpack, DownloaderFile, GameDCLink, Version } from './entities';

const getDefaultConfig = (): DataSourceOptions => {
  const config = getStaticConfig(DatabaseConfig);

  return {
    type: 'mariadb',
    port: config.port,
    database: config.db,
    username: config.user,
    password: config.password,
    host: config.host,
    charset: 'utf8mb4',
    timezone: 'Z',
    migrationsTableName: 'migrations',
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
