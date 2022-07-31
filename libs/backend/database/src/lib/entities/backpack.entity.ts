import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Backpack extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @Column('text', {
    nullable: true,
  })
  playerUuid?: string;

  @Column('text')
  inventoryName!: string;

  @Column('text', {
    nullable: true,
  })
  itemData?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
