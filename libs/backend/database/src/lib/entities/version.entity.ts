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
import { AutoMap } from '@automapper/classes';

@Entity()
export class Version extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  uuid: string;

  @Column({
    unsigned: true,
  })
  @AutoMap()
  major: number;

  @Column({
    unsigned: true,
  })
  @AutoMap()
  minor: number;

  @Column('boolean')
  @AutoMap()
  isCurrent = false;

  @CreateDateColumn()
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn()
  @AutoMap()
  updatedAt: Date;

  @OneToMany(() => DownloaderFile, (file) => file.version)
  @AutoMap(() => [DownloaderFile])
  files: DownloaderFile[];
}
