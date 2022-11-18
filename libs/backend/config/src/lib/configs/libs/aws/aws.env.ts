import { registerAs } from '@nestjs/config';
import { validateUtil } from '../../../validate.util';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class _AwsEnv {
  @IsString()
  @IsNotEmpty()
  @Expose()
  AWS_REGION: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  AWS_UPLOADER_DATA_BUCKET: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  AWS_ACCESS_KEY_ID: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  AWS_SECRET_ACCESS_KEY: string;
}

export const AwsEnv = registerAs('aws', () =>
  validateUtil(process.env, _AwsEnv),
);
