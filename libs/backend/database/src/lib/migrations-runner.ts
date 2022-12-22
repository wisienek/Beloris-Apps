import { DataSource } from 'typeorm';
import { getConfig } from './db-config';
import * as migrations from './migrations';

export const migrationsRunner = async () => {
  const dbConfig = getConfig();

  const connection = await new DataSource({
    ...dbConfig,
    synchronize: false,
    logging: true,
    name: 'MIGRATIONS_CONN',
    migrations: migrations,
  }).initialize();

  await connection.runMigrations({ transaction: 'all' });
  await connection.destroy();
};
