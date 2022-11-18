import { Inject, Injectable } from '@nestjs/common';
import { BaseConfig } from '../../../base.config';
import { _AwsEnv, AwsEnv } from './aws.env';

@Injectable()
export class AwsConfig extends BaseConfig {
  constructor(
    @Inject(AwsEnv.KEY)
    protected env: _AwsEnv,
  ) {
    super();
  }

  get region() {
    return this.env.AWS_REGION;
  }

  get uploaderBucket() {
    return this.env.AWS_UPLOADER_DATA_BUCKET;
  }

  get accessKey() {
    return this.env.AWS_ACCESS_KEY_ID;
  }

  get keySecret() {
    return this.env.AWS_SECRET_ACCESS_KEY;
  }
}
