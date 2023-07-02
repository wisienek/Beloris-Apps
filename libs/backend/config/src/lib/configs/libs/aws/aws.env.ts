import { registerAs } from '@nestjs/config';
import { validateUtil } from '../../../validate.util';
import { IsNotEmpty, IsString, IsUrl, NotEquals } from 'class-validator';
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

  @IsUrl()
  @IsNotEmpty()
  @Expose()
  AWS_CLOUDFRONT_DISTRIBUTION_URL: string;

  // Minio
  @IsString()
  @NotEquals('')
  @Expose()
  MINIO_ACCESS_KEY: string;

  @IsString()
  @NotEquals('')
  @Expose()
  MINIO_SECRET_KEY: string;

  @IsUrl({
    require_tld: false,
    require_host: true,
    require_port: true,
  })
  @NotEquals('')
  @Expose()
  MINIO_ENDPOINT_URL: string;
}

export const AwsEnv = registerAs('aws', () => validateUtil(process.env, _AwsEnv));
