import { DataSource } from 'typeorm';
import { getConfig } from './db-config';
import { migrations } from './migrations';

export const migrationsRunner = async () => {
  const dbConfig = getConfig();

  const connection = await new DataSource({
    ...dbConfig,
    synchronize: false,
    logging: true,
    name: 'MIGRATIONS_CONN',
    migrations,
  }).initialize();

  await connection.runMigrations({ transaction: 'each' });
  await connection.destroy();
};
