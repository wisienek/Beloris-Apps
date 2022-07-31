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

export class VersionDto {
  @ApiProperty({
    description: 'generated uuid',
  })
  @IsUUID()
  uuid: string;

  @ApiProperty({
    description: 'Major version',
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  major: number;

  @ApiProperty({
    description: 'Minor version',
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  minor: number;

  @ApiProperty({
    description: 'Whether the version currently applies',
  })
  @IsBoolean()
  @TransformBoolean()
  isCurrent: boolean;

  @ApiProperty({
    description: 'Timestamp of creation',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of last update',
  })
  updatedAt: Date;

  @ApiPropertyOptional()
  @IsOptional()
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
