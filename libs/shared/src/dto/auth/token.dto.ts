import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TokenDto {
  @ApiProperty({
    type: 'string',
    example: 'a0dviFB0aeFfiQpTuqHG3DMXpFnYdS',
    description: 'Access token used for identification',
  })
  @IsString()
  @Min(16)
  access_token: string;

  @ApiProperty({
    type: 'number',
    example: 604800,
    description: 'How much time is there untill this token expires',
  })
  @Min(-1)
  @Type(() => Number)
  expires_in: number;

  @ApiPropertyOptional({
    type: 'string',
    example: 'guilds identify',
    description: 'Which permissions are received by the server',
  })
  @IsString()
  @IsOptional()
  scope?: string;

  @ApiProperty({
    type: 'string',
    example: 'e551b78b2df4b16480aabb32b90072d4',
  })
  @IsString()
  state: string;

  @ApiProperty({
    type: 'string',
    example: 'Bearer',
    description: 'Who received the token',
  })
  @IsString()
  token_type: string;

  constructor(data: Partial<TokenDto>) {
    Object.assign(this, data);
  }
}
