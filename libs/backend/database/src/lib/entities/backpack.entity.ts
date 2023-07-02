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
  uuid!: string;

  @Column('text')
  @AutoMap()
  inventoryName!: string;

  @Column('json', {
    nullable: true,
  })
  @AutoMap()
  itemData?: unknown;

  @CreateDateColumn()
  @AutoMap()
  createdAt!: Date;

  @UpdateDateColumn()
  @AutoMap()
  updatedAt?: Date;
}
