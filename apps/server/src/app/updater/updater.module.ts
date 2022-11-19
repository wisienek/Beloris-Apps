import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { FileUploaderController } from './file-uploader.controller';
import { FileUploaderService } from './file-uploader.service';
import { VersionController } from './version.controller';
import { VersionService } from './version.service';

import { AwsConfig, ConfigModuleInternal } from '@bella/config';
import { DownloaderFile, Version } from '@bella/db';
import { AwsModule } from '@bella/aws';

@Module({
  imports: [
    ConfigModuleInternal.forConfigs(AwsConfig),
    TypeOrmModule.forFeature([Version, DownloaderFile]),
    AwsModule,
  ],
  controllers: [VersionController, FileUploaderController],
  providers: [VersionService, FileUploaderService],
})
export class UpdaterModule {}
