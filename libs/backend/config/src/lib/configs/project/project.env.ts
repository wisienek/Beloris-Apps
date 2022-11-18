import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';
import { validateUtil } from '../../validate.util';
import { Expose } from 'class-transformer';

export enum NodeEnv {
  PROD = 'production',
  DEV = 'development',
  TEST = 'test',
}

export class _ProjectEnv {
  @IsString()
  @Expose()
  NODE_ENV = NodeEnv.DEV;

  @IsString()
  @IsOptional()
  @Expose()
  BUCKET_CONFIG_NAME: string;
}

export const ProjectEnv = registerAs('project', () =>
  validateUtil(process.env, _ProjectEnv)
);
