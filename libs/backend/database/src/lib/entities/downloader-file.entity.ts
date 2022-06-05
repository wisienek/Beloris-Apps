import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '@bella/shared';
import { Version } from './version.entity';

@Entity()
export class DownloaderFile {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @Column()
  @ApiProperty({
    description: 'File name',
  })
  name!: string;

  @Column()
  @ApiProperty({
    description: 'Location on the bucket',
  })
  downloadPath!: string;

  @Column()
  @ApiProperty({
    description:
      'Where to save given file on pc (relative from .minecraft folder)',
  })
  savePath!: string;

  @Column({
    type: 'enum',
    enum: FileType,
  })
  @ApiProperty({
    description: 'What type of file it is',
  })
  fileType!: FileType;

  @Column({
    type: 'boolean',
    default: true,
  })
  @ApiProperty({
    description: 'If a file is required to download',
  })
  required = true;

  @ManyToOne(() => Version, (version) => version.files)
  @ApiProperty({
    description: 'Which version does the file belong to',
  })
  version: Version;

  constructor(data: Partial<DownloaderFile>) {
    Object.assign(this, data);
  }
}
