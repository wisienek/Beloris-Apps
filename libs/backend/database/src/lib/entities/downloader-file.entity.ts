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

@Entity()
export class DownloaderFile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  isPrimaryBundle?: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 512,
  })
  hash?: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name!: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  downloadPath?: string;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  savePath!: string;

  @Column({
    type: 'float',
    unsigned: true,
    nullable: true,
  })
  fileSize?: number;

  @Column({
    type: 'enum',
    enum: FileType,
  })
  fileType!: FileType;

  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
  })
  required = true;

  @Column({
    type: 'enum',
    enum: FileAction,
    default: FileAction.DOWNLOAD,
    nullable: false,
  })
  fileAction!: FileAction;

  @ManyToOne(() => Version, (version) => version.files, {
    onDelete: 'RESTRICT',
    eager: true,
  })
  @JoinTable()
  version: Version;
}
