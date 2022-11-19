import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

@Entity()
export class GameDCLink extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id!: number;

  @Column()
  @AutoMap()
  discordId!: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  @AutoMap()
  uuid!: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  @AutoMap()
  playerName!: string;
}
