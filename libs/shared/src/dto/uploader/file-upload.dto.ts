import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TransformBoolean } from '../../utils';
import { ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger';
import { FileAction } from '../../enums';

export class FileUploadDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'File name',
  })
  @MinLength(3)
  @MaxLength(32)
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Where to save current file relative to modpack folder',
  })
  savePath: string;

  @ApiProperty({
    description: 'If file is required to download',
  })
  @IsBoolean()
  @TransformBoolean()
  required: boolean;

  @ApiProperty({
    type: 'enum',
    enum: FileAction,
    default: FileAction.DOWNLOAD,
    nullable: false,
  })
  @IsEnum(FileAction)
  fileAction: FileAction;

  constructor(data: Partial<FileUploadDto>) {
    Object.assign(this, data);
  }
}

export class UploadedS3FileDto {
  @ApiProperty({
    description: 'hashed file',
  })
  @IsString()
  hash: string;

  @ApiProperty({
    description: 'File Size in Mb',
  })
  @IsNumber()
  @IsPositive()
  fileSize: number;

  @ApiProperty({
    description: 'Public download path',
  })
  @IsString()
  @IsUrl()
  downloadPath: string;
}

export class UploadPackageInfo extends IntersectionType(
  UploadedS3FileDto,
  OmitType(FileUploadDto, ['fileAction'] as const),
) {}
