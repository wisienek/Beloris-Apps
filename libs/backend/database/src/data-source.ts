import { DataSource, DataSourceOptions } from 'typeorm';
import { getConfig, migrations } from './lib';

const config = getConfig();
const dataSource = new DataSource({
  ...config,
  migrations,
  autoLoadEntities: true,
} as unknown as DataSourceOptions);

export default dataSource;
