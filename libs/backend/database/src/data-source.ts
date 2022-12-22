import { getConfig } from './lib';
import { DataSource, DataSourceOptions } from 'typeorm';

const config = getConfig();
const dataSource = new DataSource({
  ...config,
  autoLoadEntities: true,
} as unknown as DataSourceOptions);

export default dataSource;
