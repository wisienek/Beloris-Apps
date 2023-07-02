import { Injectable, Logger } from '@nestjs/common';
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  ListBucketsCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { AwsConfig, ProjectConfig } from '@bella/config';

@Injectable()
export class S3Service {
  private readonly logger: Logger;

  protected readonly s3Config: S3ClientConfig;
  protected readonly s3: S3Client;

  constructor(private awsConfig: AwsConfig, private projectConfig: ProjectConfig) {
    this.s3Config = this.projectConfig.isDev() ? this.awsConfig.devS3Options : this.awsConfig.s3Options;

    this.logger = new Logger(`${S3Service.name}:${this.projectConfig.node_env}`);

    this.s3 = new S3Client(this.s3Config);

    this.projectConfig.isDev() && this.initDevBucket(this.awsConfig.uploaderBucket);
  }

  async getObject(key: string, bucket: string) {
    const response = await this.getObjectResponse(key, bucket);
    return this.streamToBuffer(response.Body);
  }

  async exists(key: string, bucket: string): Promise<boolean> {
    let exists: boolean;
    try {
      const obj = await this.getObjectResponse(key, bucket);
      exists = !!obj;
    } catch (err) {
      exists = false;
    }

    return exists;
  }

  private async getObjectResponse(key: string, bucket: string): Promise<GetObjectCommandOutput> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
      return await this.s3.send(command);
    } catch (err) {
      if (err.name === 'NoSuchKey') {
        this.logger.error('Resource not found - return null', err);
        return null;
      }

      this.logger.error(`Cannot get object: ${key}`);
      throw err;
    }
  }

  public async streamToBuffer(stream): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  async upload(
    key: string,
    data: PutObjectCommandInput['Body'],
    bucket: string,
    shouldBePublic = false,
    contentType?: string
  ) {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: data,
      ContentType: contentType,
      ACL: shouldBePublic ? 'public-read' : 'bucket-owner-full-control',
    });

    try {
      this.logger.debug(`Saving file to ${command.input.Key} in ${command.input.Bucket}`);
      await this.s3.send(command);
      return true;
    } catch (err) {
      this.logger.error(`Cannot put object: ${key}`);
      throw err;
    }
  }

  async remove(key: string, bucket: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
      await this.s3.send(command);
      return true;
    } catch (err) {
      this.logger.error(`Cannot delete object: ${key}`);
      throw err;
    }
  }

  private async initDevBucket(bucket: string) {
    try {
      const listBucketsResult = await this.s3.send(new ListBucketsCommand({}));
      const targetBucket = listBucketsResult.Buckets.find((b) => b.Name === bucket);

      if (!targetBucket) {
        this.logger.debug(`Dev bucket ${bucket} doesn't exists, will create`);
        const createBucketResult = await this.s3.send(new CreateBucketCommand({ Bucket: bucket }));
        this.logger.debug(`Created bucket location for ${bucket}: ${createBucketResult.Location} `);
      } else {
        this.logger.debug(`All buckets already imported!`);
      }
    } catch (err) {
      this.logger.error(err.message);
    }
  }
}
