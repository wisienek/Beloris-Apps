import { EnvEnum } from '@bella/shared';

export type DatabaseConfiguration = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export type AppConfiguration = {
  port: number;
};

export type BotConfiguration = {
  id: string;
  callback: string;
  secret: string;
};

export type AwsConfig = {
  region: string;
  bucket: string;
  accessKey: string;
  accessKeyId: string;
};

export type Configuration = {
  app: AppConfiguration;
  db: DatabaseConfiguration;
  bot: BotConfiguration;
  aws: AwsConfig;
  envType: EnvEnum | string;
};
