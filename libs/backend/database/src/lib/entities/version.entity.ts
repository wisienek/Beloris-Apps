import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DownloaderFile } from '@bella/db';
import { Exclude } from 'class-transformer';

@Entity()
export class Version extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    unsigned: true,
  })
  major: number;

  @Column({
    unsigned: true,
  })
  minor: number;

  @Column('boolean')
  isCurrent = false;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => DownloaderFile, (file) => file.version)
  files: DownloaderFile[];
}
