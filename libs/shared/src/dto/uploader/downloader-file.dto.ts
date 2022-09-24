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
import { AutoMap } from '@automapper/classes';

export class DownloaderFileDto {
  @ApiPropertyOptional({
    description: 'Unique descriptor for file',
  })
  @IsUUID()
  @IsOptional()
  @AutoMap()
  uuid?: string;

  @ApiPropertyOptional({
    description: 'If a bundle is primary for a major version',
    default: false,
    nullable: false,
  })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  @AutoMap()
  isPrimaryBundle?: boolean;

  @ApiPropertyOptional({
    description: 'File size in mb',
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => value.toPrecision(2))
  @AutoMap()
  fileSize?: number;

  @ApiPropertyOptional({
    description: 'Hash of a given file (checks for changes)',
  })
  @IsOptional()
  @IsString()
  @AutoMap()
  hash?: string;

  @ApiProperty({
    description: 'File name',
  })
  @IsString()
  @AutoMap()
  name!: string;

  @ApiPropertyOptional({
    description: 'Location on the bucket',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @AutoMap()
  downloadPath?: string;

  @ApiProperty({
    description:
      'Where to save given file on pc (relative from .minecraft folder)',
  })
  @IsString()
  @AutoMap()
  savePath: string;

  @ApiPropertyOptional({
    type: 'enum',
    enum: FileType,
    description: 'What type of file it is',
  })
  @IsOptional()
  @IsEnum(FileType)
  @AutoMap()
  fileType?: FileType;

  @ApiProperty({
    description: 'If a file is required to download',
    default: true,
    nullable: false,
  })
  @IsBoolean()
  @TransformBoolean()
  @AutoMap()
  required = true;

  @Exclude()
  @ApiPropertyOptional({
    description: 'Which versions does the file belong to',
  })
  @IsOptional()
  @AutoMap(() => [VersionDto])
  versions?: VersionDto[];

  @ApiProperty({
    description: 'What to do with a file',
    enum: FileAction,
  })
  @IsEnum(FileAction)
  @AutoMap()
  fileAction!: FileAction;
}
