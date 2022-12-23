import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class BackpackItemDataDto {
  @IsString()
  @IsNotEmpty()
  nbt: string;

  @IsNumber()
  @Min(0)
  @Max(80)
  slot: number;
}

export class BackpackInventoryDataDto {
  @IsNumber()
  @Type(() => Number)
  slots: number;

  @IsArray()
  @IsObject({each: true})
  items: Array<BackpackItemDataDto>;
}

export class BackpackDto {
  @ApiProperty({
    description: 'Uuid of a backpack entity'
  })
  @IsUUID()
  @AutoMap()
  uuid: string;

  @ApiProperty({
    description: 'Inventory name'
  })
  @IsString()
  @IsNotEmpty()
  @AutoMap()
  inventoryName: string;

  @ApiPropertyOptional({
    description: 'Inventory data',
  })
  @IsOptional()
  @IsObject()
  @AutoMap()
  itemData?: BackpackInventoryDataDto;

  @ApiProperty({
    description: 'Creation date'
  })
  @AutoMap()
  @IsISO8601()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date'
  })
  @AutoMap()
  @IsISO8601()
  updatedAt: Date;
}
