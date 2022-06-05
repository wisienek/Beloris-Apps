import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '@bella/shared';
import { VersionDto } from './version.dto';
import { Exclude } from 'class-transformer';

export class DownloaderFileDto {
  @ApiProperty({
    description: 'Unique descriptor for file',
  })
  uuid!: string;

  @ApiProperty({
    description: 'File name',
  })
  name!: string;

  @ApiProperty({
    description: 'Location on the bucket',
  })
  downloadPath!: string;

  @ApiProperty({
    description:
      'Where to save given file on pc (relative from .minecraft folder)',
  })
  savePath!: string;

  @ApiProperty({
    type: 'enum',
    enum: FileType,
    description: 'What type of file it is',
  })
  fileType!: FileType;

  @ApiProperty({
    description: 'If a file is required to download',
  })
  required = true;

  @Exclude()
  @ApiProperty({
    description: 'Which version does the file belong to',
  })
  version: VersionDto;
}
