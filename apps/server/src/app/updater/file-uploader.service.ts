import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Raw, Repository } from 'typeorm';

import { MulterFile } from './typings';
import { getBucketDownloadPath, getBundleKey, getFileKey } from './utils';
import {
  FileConflictException,
  FileDataNotFoundException,
  FileNotFoundException,
  FileRecordNotFoundException,
  VersionNotFoundException,
  FileHashConflictException,
} from './errors';

import {
  DownloaderFileDto,
  FileListDto,
  FileUploadDto,
  GetFileListDto,
  UploadPackageInfo,
} from '@bella/dto';
import { FileAction, FileType } from '@bella/enums';
import { DownloaderFile, Version } from '@bella/db';
import { S3Service } from '@bella/aws';
import { getFileHash, getObjectWithoutProperties } from '@bella/core';

@Injectable()
export class FileUploaderService {
  private readonly logger = new Logger(FileUploaderService.name);

  private readonly fileBucket: string;
  private readonly awsRegion: string;

  constructor(
    @InjectRepository(Version)
    private readonly versionRepository: Repository<Version>,
    @InjectRepository(DownloaderFile)
    private readonly filesRepository: Repository<DownloaderFile>,
    private readonly awsService: S3Service,
    private readonly configService: ConfigService,
  ) {
    this.fileBucket = this.configService.get('aws.fileBucket');
    this.awsRegion = this.configService.get('aws.region');
  }

  public async getFilesToUpdate(major: number, minor: number) {
    const currentVersion = await this.versionRepository.findOne({
      where: {
        isCurrent: true,
      },
    });

    if (currentVersion.major === major && currentVersion.minor === minor)
      return new FileListDto(currentVersion, null);

    const sameMajor = currentVersion.major === major;

    const files = (
      (await this.filesRepository.find({
        where: {
          version: {
            major: currentVersion.major,
            minor: Raw(
              (alias) =>
                `${alias} > ${sameMajor ? minor : 0} and ${alias} <= ${
                  currentVersion.minor
                }`,
            ),
          },
        },
        order: {
          version: {
            minor: 'ASC',
          },
          isPrimaryBundle: 'DESC',
        },
      })) ?? []
    )?.map((file) => getObjectWithoutProperties(file, ['version']));

    return new FileListDto(currentVersion, files as DownloaderFileDto[]);
  }

  public async getFileList(
    data: GetFileListDto,
    major: number,
    minor: number,
  ): Promise<FileListDto> {
    const version = await this.versionRepository.findOneOrFail({
      where: {
        major,
        minor,
      },
    });

    const files = await this.filesRepository.find({
      where: {
        version: {
          major,
          minor,
        },
      },
    });

    return new FileListDto(version, files);
  }

  public async uploadFile(
    major: number,
    minor: number,
    data: FileUploadDto,
  ): Promise<DownloaderFileDto> {
    if (!data) throw new FileDataNotFoundException();

    const existsInDB = await this.filesRepository.findOne({
      where: {
        version: {
          major,
          minor,
        },
        savePath: data.savePath,
        fileAction: data.fileAction,
      },
    });
    if (existsInDB)
      throw new FileConflictException(
        major,
        minor,
        data.savePath,
        data.fileAction,
      );

    const version = await this.getVersion(major, minor);

    return await this.filesRepository.save({
      ...data,
      version,
    });
  }

  public async handleUploadFile(
    major: number,
    minor: number,
    file: MulterFile,
    uuid: string,
    isPackage = false,
  ): Promise<DownloaderFileDto> {
    if (!file || !uuid) throw new FileNotFoundException();

    const fileRecord = await this.filesRepository.findOne({
      where: {
        uuid,
      },
    });
    if (!fileRecord) throw new FileRecordNotFoundException(uuid);

    const fileBuffer: Buffer = file.buffer;
    const hash: string = getFileHash(fileBuffer);
    const fileKey: string = isPackage
      ? getBundleKey(major, file)
      : getFileKey(major, minor, file, fileRecord.name);
    const fileSize = Number(
      (fileBuffer.byteLength / (1_024 * 1_000)).toPrecision(2),
    );
    const downloadPath = getBucketDownloadPath(
      fileKey,
      this.fileBucket,
      this.awsRegion,
    );
    // const fileType = determineFileType(file);

    if (fileRecord.hash === hash)
      throw new FileHashConflictException(
        major,
        minor,
        fileRecord.savePath,
        fileRecord.fileAction,
      );

    this.logger.debug(
      `Uploading ${isPackage ? 'bundle' : 'file'} with size: ${fileSize}Mb`,
    );
    await this.awsService.upload(fileKey, fileBuffer, this.fileBucket);
    this.logger.debug(
      `Uploaded ${isPackage ? 'bundle' : 'file'} file: ${downloadPath}`,
    );

    return await this.filesRepository.save({
      ...fileRecord,
      hash,
      fileSize,
      downloadPath,
    });
  }

  public async createPackageData(major: number, fileData: UploadPackageInfo) {
    const version = await this.getVersion(major);

    const foundOne = await this.filesRepository.findOne({
      where: {
        version: { major },
        hash: fileData.hash,
        downloadPath: fileData.downloadPath,
      },
    });
    if (foundOne)
      throw new FileConflictException(
        major,
        1,
        fileData.savePath,
        FileAction.DOWNLOAD,
      );

    const oldBundle = await this.filesRepository.find({
      relations: ['version'],
      where: {
        version: {
          major,
        },
        isPrimaryBundle: true,
      },
    });

    const savedRecord = await this.filesRepository.save({
      ...fileData,
      version,
      isPrimaryBundle: true,
      fileType: FileType.BUNDLE,
    });

    this.logger.debug(
      `Created new Package record: ${savedRecord.downloadPath}, ${savedRecord.hash}, primary ${major}: ${savedRecord.isPrimaryBundle}`,
    );

    if (savedRecord) await this.filesRepository.remove(oldBundle);

    return savedRecord;
  }

  private async getVersion(major: number, minor: number = 1): Promise<Version> {
    const foundVersion = await this.versionRepository.findOne({
      where: {
        major,
        minor,
      },
    });
    if (!foundVersion) throw new VersionNotFoundException(major, minor);

    return foundVersion;
  }

  public async clearUnusedFiles() {
    /*
        TODO: Cron job
        auto delete files that are  without records but inside s3
     */
    return true;
  }
}
