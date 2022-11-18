import { Module } from '@nestjs/common';
import { AwsConfig, ConfigModuleInternal } from '@bella/config';
import { S3Service } from './s3.service';

@Module({
  imports: [ConfigModuleInternal.forConfigs(AwsConfig)],
  providers: [S3Service],
  exports: [S3Service],
})
export class AwsModule {}
