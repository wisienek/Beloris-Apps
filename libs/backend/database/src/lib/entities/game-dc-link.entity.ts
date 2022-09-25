import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class GameDCLink extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @ApiProperty({
    type: 'string',
    example: '873499120877305876',
    description: 'Discord id for the link',
  })
  discordId!: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  @ApiProperty({
    type: 'string',
    example: 'uu-2131u-id123-one1',
    description: 'UUID of game account connected to the discord',
  })
  uuid!: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  @ApiProperty({
    type: 'string',
    example: 'Player_123',
    description: 'Player name',
  })
  playerName!: string;
}
