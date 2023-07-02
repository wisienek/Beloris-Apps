import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class GameDcLinkDto {
  @ApiProperty({
    description: `Link id`,
  })
  @IsUUID('4')
  @AutoMap()
  id!: string;

  @ApiProperty({
    type: 'string',
    example: '873499120877305876',
    description: 'Discord id for the link',
  })
  @IsString()
  @MinLength(16)
  @IsNotEmpty()
  @AutoMap()
  discordId!: string;

  @ApiProperty({
    type: 'string',
    example: 'uu-2131u-id123-one1',
    description: 'UUID of game account connected to the discord',
  })
  @IsUUID('4')
  @AutoMap()
  uuid!: string;

  @ApiProperty({
    type: 'string',
    example: 'Player_123',
    description: 'Player name',
  })
  @IsString()
  @IsNotEmpty()
  @AutoMap()
  playerName!: string;
}
