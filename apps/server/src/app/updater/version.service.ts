import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Version } from '@bella/db';
import {
  CreatedVersion,
  CreateVersionDto,
  DeleteVersionDto,
  VersionDto,
} from '@bella/dto';
import { FileUploaderService } from './file-uploader.service';
import {
  VersionNotFoundException,
  VersionNotUpdatableException,
  VersionConflictException,
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

  public async getCurrentVersion(): Promise<VersionDto> {
    const version = await this.versionRepository.findOne({
      relations: ['files'],
      where: {
        isCurrent: true,
      },
    });

    return this.mapper.map(version, Version, VersionDto);
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
  }: CreateVersionDto): Promise<CreatedVersion> {
    const fromDb = await this.versionRepository.findOne({
      where: {
        major: major,
        minor: minor,
      },
    });
    if (fromDb) throw new VersionConflictException(major, minor);

    const created = await this.versionRepository.create({
      major,
      minor,
      isCurrent,
    });
    const entitiesToSave: DeepPartial<Version>[] = [created];

    if (created.isCurrent) {
      const currentVersion = await this.getCurrentVersion();

      if (currentVersion)
        entitiesToSave.push({ ...currentVersion, isCurrent: false });
    }

    const [savedOld, savedNew] = await this.versionRepository.save(
      entitiesToSave,
    );

    this.logger.debug(
      `Created version ${created.major}:${created.minor}, current: ${created.isCurrent}`,
    );

    return {
      old: this.mapper.map(savedOld, Version, VersionDto),
      new: this.mapper.map(savedNew, Version, VersionDto),
    };
  }

  public async updateCurrentVersion({
    major,
    minor,
    isCurrent,
  }: CreateVersionDto): Promise<CreatedVersion> {
    const fromDb = await this.versionRepository.findOne({
      where: {
        major: major,
        minor: minor,
      },
    });
    if (!fromDb) throw new VersionNotFoundException(major, minor);

    if (fromDb.isCurrent === isCurrent)
      throw new VersionNotUpdatableException(major, minor, isCurrent);

    const entitiesToSave: DeepPartial<Version>[] = [];

    if (!fromDb.isCurrent && isCurrent) {
      const currentVersion = await this.getCurrentVersion();

      if (currentVersion)
        entitiesToSave.push({ ...currentVersion, isCurrent: false });
    }
    fromDb.isCurrent = isCurrent;
    entitiesToSave.push(fromDb);

    const [savedOld, savedNew] = await this.versionRepository.save(
      entitiesToSave,
    );

    this.logger.debug(`Updated current version: ${major}:${minor}`);

    return {
      old: this.mapper.map(savedOld, Version, VersionDto),
      new: this.mapper.map(savedNew, Version, VersionDto),
    };
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
