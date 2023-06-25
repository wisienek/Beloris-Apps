import { Module } from '@nestjs/common';
import { AwsConfig, ConfigModuleInternal, ProjectConfig } from '@bella/config';
import { S3Service } from './s3.service';

@Module({
  imports: [ConfigModuleInternal.forConfigs(AwsConfig, ProjectConfig)],
  providers: [S3Service],
  exports: [S3Service],
})
export class AwsModule {}
