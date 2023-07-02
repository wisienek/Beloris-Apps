import { Inject, Injectable } from '@nestjs/common';
import { BaseConfig } from '../../../base.config';
import { _AwsEnv, AwsEnv } from './aws.env';
import { S3ClientConfig } from '@aws-sdk/client-s3';

@Injectable()
export class AwsConfig extends BaseConfig {
  constructor(
    @Inject(AwsEnv.KEY)
    protected env: _AwsEnv
  ) {
    super();
  }

  get region() {
    return this.env.AWS_REGION;
  }

  get uploaderBucket() {
    return this.env.AWS_UPLOADER_DATA_BUCKET;
  }

  get cfDistribution() {
    return this.env.AWS_CLOUDFRONT_DISTRIBUTION_URL;
  }

  get s3Options(): Partial<S3ClientConfig> {
    return {
      region: this.env.AWS_REGION,
      credentials: {
        accessKeyId: this.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.env.AWS_SECRET_ACCESS_KEY,
      },
      apiVersion: '2010-12-01',
    };
  }

  get devS3Options(): Partial<S3ClientConfig> {
    return {
      credentials: {
        accessKeyId: this.env.MINIO_ACCESS_KEY,
        secretAccessKey: this.env.MINIO_SECRET_KEY,
      },
      endpoint: this.env.MINIO_ENDPOINT_URL,
      forcePathStyle: true,
    };
  }
}
