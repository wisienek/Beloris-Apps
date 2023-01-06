import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Repository } from 'typeorm';
import { Version } from '@bella/db';
import {
  CreateVersionDto,
  DeleteVersionDto,
  UpdateVersionDto,
  VersionDto,
} from '@bella/dto';
import { FileUploaderService } from './file-uploader.service';
import {
  VersionConflictException,
  VersionNotFoundException,
  VersionNotUpdatableException,
} from './errors';

@Injectable()
export class VersionService {
  private logger = new Logger(VersionService.name);

  constructor(
    @InjectRepository(Version)
    private readonly versionRepository: Repository<Version>,
    private readonly fileUploaderService: FileUploaderService,
    @InjectMapper() private mapper: Mapper,
  ) {}

  public async getCurrentVersion(
    map = true,
    withFiles = true,
  ): Promise<VersionDto | Version> {
    const version = await this.versionRepository.findOne({
      relations: withFiles ? ['files'] : [],
      where: {
        isCurrent: true,
      },
    });

    return map ? this.mapper.map(version, Version, VersionDto) : version;
  }

  public async getSpecificVersion(
    major: number,
    minor: number,
    map = true,
    withFiles = true,
  ): Promise<VersionDto | Version> {
    const version = await this.versionRepository.findOne({
      relations: withFiles ? ['files'] : [],
      where: {
        major,
        minor,
      },
    });

    return map ? this.mapper.map(version, Version, VersionDto) : version;
  }

  public async getVersionHistory(): Promise<VersionDto[]> {
    const history = await this.versionRepository.find({
      order: {
        major: 'DESC',
        minor: 'DESC',
      },
    });

    return this.mapper.mapArray(history, Version, VersionDto);
  }

  public async createVersion({
    major,
    minor,
    isCurrent,
  }: CreateVersionDto): Promise<VersionDto> {
    const fromDb = await this.versionRepository.findOne({
      where: {
        major: major,
        minor: minor,
      },
    });
    if (fromDb) throw new VersionConflictException(major, minor);

    const created = this.versionRepository.create({
      major,
      minor,
      isCurrent,
    });

    if (created.isCurrent) {
      const currentVersion = await this.getCurrentVersion(false, false);

      if (currentVersion)
        await this.versionRepository.save({
          ...currentVersion,
          isCurrent: false,
        });
    }

    const saved = await this.versionRepository.save(created);

    this.logger.debug(
      `Created version ${created.major}:${created.minor}, current: ${created.isCurrent}`,
    );

    return this.mapper.map(saved, Version, VersionDto);
  }

  public async updateCurrentVersion(
    major: number,
    minor: number,
    data: UpdateVersionDto,
  ): Promise<VersionDto> {
    const fromDb = await this.versionRepository.findOne({
      where: {
        major: major,
        minor: minor,
      },
    });
    if (!fromDb) throw new VersionNotFoundException(major, minor);

    if ('isCurrent' in data && fromDb.isCurrent === data.isCurrent)
      throw new VersionNotUpdatableException(major, minor, data.isCurrent);

    if (!fromDb.isCurrent && data.isCurrent === true) {
      const currentVersion = await this.getCurrentVersion(false, false);

      if (currentVersion)
        await this.versionRepository.save({
          ...currentVersion,
          isCurrent: false,
        });
    }

    fromDb.isCurrent = data.isCurrent;

    const updated = await this.versionRepository.save(fromDb);

    this.logger.debug(`Updated current version: ${major}:${minor}`);

    return this.mapper.map(updated, Version, VersionDto);
  }

  public async deleteVersion({
    major,
    minor,
  }: DeleteVersionDto): Promise<VersionDto> {
    const fromDb = await this.versionRepository.findOne({
      where: {
        major: major,
        minor: minor,
      },
    });
    if (!fromDb) throw new VersionNotFoundException(major, minor);

    // await this.fileUploaderService.deleteVersionFiles(fromDb);

    this.logger.debug(`Deleted version ${major}:${minor}!`);

    const deleted = await this.versionRepository.remove(fromDb);

    return this.mapper.map(deleted, Version, VersionDto);
  }
}
