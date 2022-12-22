import { AutoMap } from '@automapper/classes';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Backpack {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id!: string;

  @Column('text', {
    nullable: true,
  })
  @AutoMap()
  playerUuid?: string;

  @Column('text')
  @AutoMap()
  inventoryName!: string;

  @Column('text', {
    nullable: true,
  })
  @AutoMap()
  itemData?: string;

  @CreateDateColumn()
  @AutoMap()
  createdAt!: Date;

  @UpdateDateColumn()
  @AutoMap()
  updatedAt?: Date;
}
