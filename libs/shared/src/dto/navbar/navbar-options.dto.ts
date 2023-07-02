import { IsArray, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { NavbarOptions } from '@bella/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class NavbarOption {
  @IsString()
  @Length(3)
  name!: string;

  @IsString()
  @Length(3)
  icon!: string;

  @IsOptional()
  @IsString()
  @Length(3)
  to?: string;
}

export class NavbarOptionsDto {
  @ApiPropertyOptional({
    description: `Public navbar options`,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested()
  [NavbarOptions.PUBLIC]?: NavbarOption[] = [];

  @ApiPropertyOptional({
    description: `Admin navbar options`,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested()
  [NavbarOptions.ADMIN]?: NavbarOption[] = [];

  @ApiPropertyOptional({
    description: `Testing navbar options`,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested()
  [NavbarOptions.TESTING]?: NavbarOption[] = [];
}
