import { AxiosInstance, AxiosResponse } from 'axios';
import { existsSync, readFileSync } from 'fs';
import * as FormData from 'form-data';
import { resolve } from 'path';
import { VersionType } from '@bella/types';
import { ApiRoutes } from '@bella/data';
import { FileType } from '@bella/enums';
import {
  DownloaderFileDto,
  FileUploadDto,
  IpcEventDto,
  UploadPackageInfo,
} from '@bella/dto';
import { getOrCreateVersion, getVersion } from './version';
import { handlerWrapper } from '../handler-wrapper';
import { readUserSettings } from './user-settings';
import {
  ElectronLogger,
  getPackageName,
  getPackagePath,
  getInstance,
} from '../utils';

export class UploaderHandler {
  private readonly logger = new ElectronLogger(UploaderHandler.name);
  private readonly axiosInstance: AxiosInstance = getInstance();

  public uploadPackage(
    version: VersionType,
    packageData: UploadPackageInfo,
    setCurrentVersion?: boolean,
  ): Promise<IpcEventDto<DownloaderFileDto>> {
    return handlerWrapper(
      async () => {
        const { data: userSettings } = await readUserSettings();

        const buffer = readFileSync(
          getPackagePath(userSettings.downloadTo.modpackFolder, version.major),
        );

        await getOrCreateVersion({ ...version, minor: 1 }, setCurrentVersion);
        const existingVersion = await getVersion({ ...version, minor: 1 });

        const hasPackageFile = existingVersion.files.find(
          (f) => f.fileType === FileType.BUNDLE || f.isPrimaryBundle,
        );

        this.logger
          .debug(
            `${hasPackageFile ? `Updating` : 'Uploading'} package data for ${
              existingVersion.id
            }:`,
          )
          .debug(packageData);

        const { data: uploadedInfo }: AxiosResponse<DownloaderFileDto> =
          await this.axiosInstance({
            method: hasPackageFile ? 'patch' : 'post',
            url: hasPackageFile
              ? ApiRoutes.PACKAGE_EDIT(
                  version.major,
                  version.minor,
                  existingVersion.id,
                )
              : ApiRoutes.PACKAGE(version.major, version.minor),
            data: packageData,
          });

        this.logger.debug(`Uploaded package info`).debug(uploadedInfo);

        const packageName = getPackageName(version.major);
        const formData = new FormData();
        formData.append('file', buffer, packageName);

        this.logger.debug(`Sending file ${packageName}`);
        const { data: uploadedPackage }: AxiosResponse<DownloaderFileDto> =
          await this.axiosInstance({
            method: 'post',
            url: ApiRoutes.PACKAGE_UPLOAD(
              version.major,
              version.minor,
              uploadedInfo.id,
            ),
            data: formData,
            headers: formData.getHeaders(),
          });

        this.logger.debug(`Uploaded package file:`).debug(uploadedPackage);

        return uploadedPackage;
      },
      this.logger,
      `Error while uploading package`,
    );
  }

  public uploadFiles(
    version: VersionType,
    filesData: Array<FileUploadDto>,
    setCurrentVersion?: boolean,
  ): Promise<IpcEventDto<Array<DownloaderFileDto>>> {
    return handlerWrapper(
      async () => {
        const { data: userSettings } = await readUserSettings();

        await getOrCreateVersion(version, setCurrentVersion);

        const versionFiles = await getVersion(version);

        const fileDataPostUrl = ApiRoutes.FILE_LIST(
          version.major,
          version.minor,
        );

        const preparedRequests = [];

        this.logger.debug(`Sending ${filesData.length} files to server!`);

        for (const fileData of filesData) {
          this.logger.debug(`File ${fileData.name}`);

          const filePath = resolve(
            userSettings.downloadTo.modpackFolder,
            fileData.savePath,
          );

          this.logger.debug(`File path: ${filePath}`);

          if (!existsSync(filePath))
            throw new Error(`Plik ${fileData.name} nie mógł być znaleziony!`);

          const buffer = readFileSync(filePath);

          // TODO: add check post/path based on get version files
          preparedRequests.push(
            this.axiosInstance({
              method: 'post',
              url: fileDataPostUrl,
              data: fileData,
            }).then(
              async ({ data }: AxiosResponse<DownloaderFileDto>) =>
                await this.updateFileData(data, buffer, version),
            ),
          );
        }

        return await Promise.all(preparedRequests);
      },
      this.logger,
      `Error while uploading package`,
    );
  }

  private async updateFileData(
    dFileData: DownloaderFileDto,
    buffer: Buffer,
    version: VersionType,
  ): Promise<DownloaderFileDto> {
    this.logger.debug(`Received data:`).debug(dFileData);

    const sendFileUrl = ApiRoutes.FILE_LIST_UPLOAD(version, dFileData.id);

    this.logger.debug(`Sending file for data: ${dFileData.name}`);

    const formData = new FormData();
    formData.append('file', buffer, dFileData.name);

    const { data }: AxiosResponse<DownloaderFileDto> = await this.axiosInstance(
      {
        method: 'post',
        url: sendFileUrl,
        data: formData,
        headers: formData.getHeaders(),
      },
    );

    this.logger.debug(`File sent successfully!`).debug(data);

    return data;
  }
}

export const uploaderHandler = new UploaderHandler();
