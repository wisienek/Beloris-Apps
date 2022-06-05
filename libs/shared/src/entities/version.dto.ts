import { TransformBoolean } from '../utils';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class VersionDto {
  @Exclude()
  @IsString()
  uuid: string;

  @ApiProperty({
    description: 'Major version',
  })
  @IsInt()
  @Min(0)
  @Max(99)
  major: number;

  @ApiProperty({
    description: 'Minor revision',
  })
  @IsInt()
  @Min(0)
  @Max(99)
  minor: number;

  @ApiProperty({
    description: 'Is this a current version?',
  })
  @TransformBoolean()
  @IsBoolean()
  isCurrent = false;

  @ApiProperty({
    description: 'When was the version created',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    description: 'When was the version last updated',
  })
  @IsDateString()
  updatedAt: Date;
}
