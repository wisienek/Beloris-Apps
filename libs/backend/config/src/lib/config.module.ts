import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClassConstructor } from 'class-transformer';
import { BaseConfig } from './base.config';
import {
  DatabaseConfig,
  DiscordConfig,
  ProjectConfig,
  ServerConfig,
  AwsConfig,
  DatabaseEnv,
  DiscordEnv,
  ProjectEnv,
  ServerEnv,
  AwsEnv,
} from './configs';

const CONFIGS = {
  [ProjectConfig.name]: ProjectEnv,
  [ServerConfig.name]: ServerEnv,
  [DatabaseConfig.name]: DatabaseEnv,
  [DiscordConfig.name]: DiscordEnv,
  [AwsConfig.name]: AwsEnv,
};

export function getStaticConfig<T>(config: ClassConstructor<T>): T {
  const configEnv = CONFIGS[config.name];
  return new config(configEnv());
}

@Module({})
export class ConfigModuleInternal {
  static forConfigs(...configs: ClassConstructor<BaseConfig>[]): DynamicModule {
    const configFeatures: DynamicModule[] = configs.map((config) => {
      const configEnv = CONFIGS[config.name];
      return ConfigModule.forFeature(configEnv);
    });

    const envFilePath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

    return {
      module: ConfigModuleInternal,
      imports: [ConfigModule.forRoot({ envFilePath }), ...configFeatures],
      providers: [...configs],
      exports: [...configs],
    };
  }
}
