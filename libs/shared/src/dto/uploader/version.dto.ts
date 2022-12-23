import { AutoMap } from '@automapper/classes';
import { Type } from 'class-transformer';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { DownloaderFileDto } from './downloader-file.dto';

export class VersionDto {
  @ApiProperty({
    description: 'generated uuid',
  })
  @IsUUID()
  @AutoMap()
  id: string;

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

  @AutoMap()
  @ApiProperty({
    description: 'Whether the version currently applies',
  })
  isCurrent: boolean;

  @ApiProperty({
    description: 'Timestamp of creation',
  })
  @IsISO8601()
  @AutoMap()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of last update',
  })
  @IsISO8601()
  @AutoMap()
  updatedAt: Date;

  @ApiPropertyOptional({
    description: `Files in current version`,
  })
  @IsOptional()
  @AutoMap(() => DownloaderFileDto)
  files: DownloaderFileDto[] = [];
}

export class UpdateVersionDto extends PartialType(
  OmitType(VersionDto, ['major', 'minor', 'files', 'createdAt', 'updatedAt']),
) {}

export class CreateVersionDto extends PickType(VersionDto, [
  'major',
  'minor',
  'isCurrent',
] as const) {}

export class DeleteVersionDto extends PickType(VersionDto, [
  'major',
  'minor',
] as const) {}
