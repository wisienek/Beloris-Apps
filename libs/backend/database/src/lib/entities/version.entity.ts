import { AutoMap } from '@automapper/classes';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DownloaderFile } from './downloader-file.entity';

@Entity()
@Index(['major', 'minor'], { unique: true })
export class Version {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

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

  @Column('boolean', { default: false })
  @AutoMap()
  isCurrent = false;

  @CreateDateColumn()
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn()
  @AutoMap()
  updatedAt: Date;

  @OneToMany(() => DownloaderFile, (file) => file.version)
  @AutoMap(() => DownloaderFile)
  files: DownloaderFile[];
}
