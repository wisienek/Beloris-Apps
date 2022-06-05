import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileListDto, GetFileListDto } from '@bella/shared';
import { DownloaderFile, Version } from '@bella/db';

@Injectable()
export class UploaderService {
  private logger = new Logger(UploaderService.name);

  constructor(
    @InjectRepository(Version)
    private readonly versionRepository: Repository<Version>,
    @InjectRepository(DownloaderFile)
    private readonly filesRepository: Repository<DownloaderFile>
  ) {}

  public async getCurrentVersion(): Promise<Version> {
    return await this.versionRepository.findOne({
      where: {
        isCurrent: true,
      },
    });
  }

  public async getFileList(
    data: GetFileListDto,
    major: number,
    minor: number
  ): Promise<FileListDto> {
    const version = await this.versionRepository.findOneOrFail({
      where: {
        major,
        minor,
      },
    });

    const files = await this.filesRepository.find({
      where: Object.assign(
        { version },
        data.requiredOnly && { required: true }
      ),
    });

    return new FileListDto(version, files);
  }
}
