import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileAction, FileType } from '@bella/enums';
import { Version } from './version.entity';
import { AutoMap } from '@automapper/classes';

@Entity()
export class DownloaderFile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id!: string;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  @AutoMap()
  isPrimaryBundle?: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 512,
  })
  @AutoMap()
  hash?: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @AutoMap()
  name!: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @AutoMap()
  downloadPath?: string;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  @AutoMap()
  savePath!: string;

  @Column({
    type: 'float',
    unsigned: true,
    nullable: true,
  })
  @AutoMap()
  fileSize?: number;

  @Column({
    type: 'enum',
    enum: FileType,
  })
  @AutoMap()
  fileType!: FileType;

  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
  })
  @AutoMap()
  required = true;

  @Column({
    type: 'enum',
    enum: FileAction,
    default: FileAction.DOWNLOAD,
    nullable: false,
  })
  @AutoMap()
  fileAction!: FileAction;

  @ManyToOne(() => Version, (version) => version.files, {
    onDelete: 'RESTRICT',
    eager: true,
  })
  @JoinTable()
  @AutoMap(() => Version)
  version: Version;
}
