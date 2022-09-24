import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransformBoolean } from '../../utils';
import { DownloaderFileDto } from './downloader-file.dto';
import { AutoMap } from '@automapper/classes';

export class VersionDto {
  @ApiProperty({
    description: 'generated uuid',
  })
  @IsUUID()
  @AutoMap()
  uuid: string;

  @ApiProperty({
    description: 'Major version',
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @AutoMap()
  major: number;

  @ApiProperty({
    description: 'Minor version',
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @AutoMap()
  minor: number;

  @ApiProperty({
    description: 'Whether the version currently applies',
  })
  @IsBoolean()
  @TransformBoolean()
  @AutoMap()
  isCurrent: boolean;

  @ApiProperty({
    description: 'Timestamp of creation',
  })
  @AutoMap()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of last update',
  })
  @AutoMap()
  updatedAt: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @AutoMap(() => [DownloaderFileDto])
  files?: DownloaderFileDto[];
}

export class CreateVersionDto extends PickType(VersionDto, [
  'major',
  'minor',
  'isCurrent',
] as const) {}

export class DeleteVersionDto extends PickType(VersionDto, [
  'major',
  'minor',
] as const) {}
