import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity()
export class GameDCLink {
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
