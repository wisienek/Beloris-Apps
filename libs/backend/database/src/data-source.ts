import { DataSource, DataSourceOptions } from 'typeorm';
import { getConfig } from './lib';

const config = getConfig();
const dataSource = new DataSource({
  ...config,
  autoLoadEntities: true,
} as unknown as DataSourceOptions);

export default dataSource;
