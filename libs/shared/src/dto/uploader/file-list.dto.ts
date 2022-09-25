import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

import { DownloaderFileDto } from './downloader-file.dto';
import { TransformBoolean } from '../../utils';
import { VersionDto } from './version.dto';

export class FileListDto {
  constructor(currentVersion: VersionDto, files: DownloaderFileDto[]) {
    this.version = currentVersion;
    this.files = files;
  }

  @ApiProperty({
    description: 'Current version info',
  })
  version: VersionDto;

  @ApiProperty({
    description: 'List of files for given version',
  })
  files: DownloaderFileDto[];
}

export class GetFileListDto {
  @ApiProperty({
    description: 'Should return only required files?',
  })
  @TransformBoolean()
  @IsBoolean()
  requiredOnly = false;
}
