import { Injectable } from '@nestjs/common';
import { AwsConfig } from '@bella/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
	protected readonly s3: AWS.S3;

	constructor(private config: AwsConfig) {
		this.s3 = new AWS.S3({
			region: config.region,
			credentials: {
				accessKeyId: config.accessKey,
				secretAccessKey: config.keySecret,
			},
			httpOptions: {
				timeout: 30 * 60 * 1000, // 30 minutes
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

	async getObject(key: string, bucket: string) {
		const got = await this.s3
			.getObject({
				Bucket: bucket,
				Key: key,
			})
			.promise()

		return got.Body as Buffer;
	}

	async listObjects(prefix: string, bucket: string) {
		return this.s3.listObjects({
			Bucket: bucket,
			Prefix: prefix,
		});
	}

	async upload(key: string, data: AWS.S3.Body, bucket: string, shouldBePublic = false) {
		return this.s3
			.putObject({
				Bucket: bucket,
				Body: data,
				Key: key,
				ACL: shouldBePublic ? 'public-read' : 'bucket-owner-full-control',
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
