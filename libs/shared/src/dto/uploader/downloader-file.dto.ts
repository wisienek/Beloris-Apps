import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VersionDto } from './version.dto';
import { Exclude, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
} from 'class-validator';

import { TransformBoolean } from '../../utils';
import { FileAction, FileType } from '../../enums';

export class DownloaderFileDto {
  @ApiProperty({
    description: 'Unique descriptor for file',
  })
  @IsUUID()
  uuid!: string;

  @ApiPropertyOptional({
    description: 'If a bundle is primary for a major version',
    default: false,
    nullable: false,
  })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  isPrimaryBundle?: boolean;

  @ApiPropertyOptional({
    description: 'File size in mb',
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => value.toPrecision(2))
  fileSize?: number;

  @ApiPropertyOptional({
    description: 'Hash of a given file (checks for changes)',
  })
  @IsOptional()
  @IsString()
  hash?: string;

  @ApiProperty({
    description: 'File name',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    description: 'Location on the bucket',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  downloadPath?: string;

  @ApiProperty({
    description:
      'Where to save given file on pc (relative from .minecraft folder)',
  })
  @IsString()
  savePath: string;

  @ApiPropertyOptional({
    type: 'enum',
    enum: FileType,
    description: 'What type of file it is',
  })
  @IsOptional()
  @IsEnum(FileType)
  fileType?: FileType;

  @ApiProperty({
    description: 'If a file is required to download',
    default: true,
    nullable: false,
  })
  @IsBoolean()
  @TransformBoolean()
  required = true;

  @Exclude()
  @ApiPropertyOptional({
    description: 'Which versions does the file belong to',
  })
  @IsOptional()
  versions?: VersionDto[];

  @ApiProperty({
    description: 'What to do with a file',
    enum: FileAction,
  })
  @IsEnum(FileAction)
  fileAction!: FileAction;
}
