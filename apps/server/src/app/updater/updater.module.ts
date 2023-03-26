import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AwsConfig, ConfigModuleInternal } from '@bella/config';
import { DownloaderFile, Version } from '@bella/db';
import { AwsModule } from '@bella/aws';
import { FileUploaderController } from './file-uploader.controller';
import { FileUploaderService } from './file-uploader.service';
import { VersionController } from './version.controller';
import { NavbarController } from './navbar.controller';
import { VersionService } from './version.service';
import { NavbarService } from './navbar.service';

@Module({
  imports: [ConfigModuleInternal.forConfigs(AwsConfig), TypeOrmModule.forFeature([Version, DownloaderFile]), AwsModule],
  controllers: [VersionController, FileUploaderController, NavbarController],
  providers: [VersionService, FileUploaderService, NavbarService],
})
export class UpdaterModule {}
