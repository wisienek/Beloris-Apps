import { Injectable } from '@nestjs/common';
import { AwsConfig } from '@bella/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  protected s3: AWS.S3;

  constructor(protected awsConfig: AwsConfig) {
    this.s3 = new AWS.S3({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.accessKey,
      },
      apiVersion: '2010-12-01',
    });
  }

  download(key: string, bucket: string) {
    return this.s3.getObject({
      Bucket: bucket,
      Key: key,
    });
  }

  async downloadFromAws(key: string, bucket: string) {
    return this.s3
      .getObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();
  }

  async listObjects(prefix: string, bucket: string) {
    return this.s3.listObjects({
      Bucket: bucket,
      Prefix: prefix,
    });
  }

  async upload(key: string, data: string, bucket: string) {
    return this.s3
      .putObject({
        Bucket: bucket,
        Body: data,
        Key: key,
      })
      .promise();
  }

  async remove(key: string, bucket: string) {
    this.s3
      .deleteObject({
        Bucket: bucket,
        Key: key,
      })
      .send();
  }
}
