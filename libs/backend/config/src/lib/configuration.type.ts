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

export type Configuration = {
  app: AppConfiguration;
  db: DatabaseConfiguration;
  bot: BotConfiguration;
  envType: EnvEnum | string;
};
