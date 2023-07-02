import { existsSync, readFileSync } from 'fs';
import { AxiosResponse } from 'axios';
import * as FormData from 'form-data';
import { resolve } from 'path';
import { DownloaderFileDto, FileUploadDto, IpcEventDto, UploadPackageInfo } from '@bella/dto';
import { VersionType } from '@bella/types';
import { getFileHash } from '@bella/core';
import { ApiRoutes } from '@bella/data';
import { FileAction, FileType, IPCChannels } from '@bella/enums';
import { getPackageName, getPackagePath } from '../utils';
import { handlerWrapper } from './handler-wrapper';
import { readUserSettings } from './user-settings';
import { BaseHandler } from './base-handler';
import { versionHandler } from './version';
import App from '../app/app';

export class UploaderHandler extends BaseHandler {
  constructor() {
    super(UploaderHandler.name);
  }

  public uploadPackage(
    version: VersionType,
    packageData: UploadPackageInfo,
    setCurrentVersion?: boolean
  ): Promise<IpcEventDto<DownloaderFileDto>> {
    return handlerWrapper(
      async () => {
        const { data: userSettings } = await readUserSettings();

        const buffer = readFileSync(getPackagePath(userSettings.downloadTo.modpackFolder, version.major));

        this.logger.log(`Get Or create version: ${JSON.stringify({ ...version, minor: 1 })}`);
        await versionHandler.getOrCreateVersion({ ...version, minor: 1 }, setCurrentVersion);
        const existingVersion = await versionHandler.getVersion({ ...version, minor: 1 });

        const hasPackageFile = existingVersion.files.find((f) => f.fileType === FileType.BUNDLE || f.isPrimaryBundle);

        this.logger
          .debug(`${hasPackageFile ? `Updating` : 'Uploading'} package data for ${existingVersion.id}:`)
          .debug(packageData);

        const { data: uploadedInfo }: AxiosResponse<DownloaderFileDto> = await this.axiosInstance({
          method: hasPackageFile ? 'patch' : 'post',
          url: hasPackageFile
            ? ApiRoutes.PACKAGE_EDIT(version.major, version.minor, hasPackageFile.id)
            : ApiRoutes.PACKAGE(version.major, version.minor),
          data: packageData,
        });

        this.logger.debug(`Uploaded package info`).debug(uploadedInfo);

        const packageName = getPackageName(version.major);
        const formData = new FormData();
        formData.append('file', buffer, packageName);

        this.logger.debug(`Sending file ${packageName}`);
        const { data: uploadedPackage }: AxiosResponse<DownloaderFileDto> = await this.axiosInstance({
          method: 'post',
          url: ApiRoutes.PACKAGE_UPLOAD(version.major, version.minor, uploadedInfo.id),
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          data: formData,
          headers: formData.getHeaders(),
        });

        this.logger.debug(`Uploaded package file:`).debug(uploadedPackage);

        return uploadedPackage;
      },
      this.logger,
      `Error while uploading package`
    );
  }

  public uploadFiles(
    version: VersionType,
    filesData: Array<FileUploadDto>,
    setCurrentVersion?: boolean
  ): Promise<IpcEventDto<Array<DownloaderFileDto>>> {
    return handlerWrapper(
      async () => {
        const { data: userSettings } = await readUserSettings();

        await versionHandler.getOrCreateVersion(version, setCurrentVersion);

        const versionFiles = await versionHandler.getVersion(version);

        const preparedRequests = [];

        this.logger.debug(`Sending ${filesData.length} files to server!`);

        for (const fileData of filesData) {
          this.logger.debug(`File ${fileData.name}`);

          const filePath = resolve(userSettings.downloadTo.modpackFolder, fileData.savePath);

          this.logger.debug(`File path: ${filePath}`);

          if (!existsSync(filePath)) throw new Error(`Plik ${fileData.name} nie mógł być znaleziony!`);

          const buffer = readFileSync(filePath);
          fileData.hash = getFileHash(buffer);

          const existsFile = versionFiles.files.find((file) => file.name === fileData.name);
          const fileDataPostUrl = existsFile
            ? `${ApiRoutes.FILE_LIST(version.major, version.minor)}/${existsFile.id}`
            : ApiRoutes.FILE_LIST(version.major, version.minor);

          preparedRequests.push(
            this.axiosInstance({
              method: existsFile ? 'patch' : 'post',
              url: fileDataPostUrl,
              data: fileData,
            }).then(
              async ({ data }: AxiosResponse<DownloaderFileDto>) => await this.updateFileData(data, buffer, version)
            )
          );
        }

        return await Promise.all(preparedRequests);
      },
      this.logger,
      `Error while uploading package`
    );
  }

  private async updateFileData(
    dFileData: DownloaderFileDto,
    buffer: Buffer,
    version: VersionType
  ): Promise<DownloaderFileDto> {
    if (!dFileData.id) throw new Error(`Brak id pliku do przesłania!`);
    if (dFileData.fileAction === FileAction.DELETE) {
      this.logger.debug(`Delete action, skipping upload.`);
      return dFileData;
    }

    this.logger.debug(`Received data:`).debug(dFileData);

    const sendFileUrl = ApiRoutes.FILE_LIST_UPLOAD(version, dFileData.id);

    this.logger.debug(`Sending file for data: ${dFileData.name}`);

    const formData = new FormData();

    const splitPath = dFileData.savePath.split('/');
    const fileNameWithExt = splitPath[splitPath.length - 1];

    this.logger.debug(`updateFileData uploading file:`, dFileData, fileNameWithExt);

    formData.append('file', buffer, fileNameWithExt);

    const { data }: AxiosResponse<DownloaderFileDto> = await this.axiosInstance({
      method: 'post',
      url: sendFileUrl,
      data: formData,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: formData.getHeaders(),
    });

    this.logger.debug(`File sent successfully!`).debug(data);

    App.mainWindow.webContents.send(IPCChannels.UPLOAD_PROGRESS, dFileData);

    return data;
  }
}

export const uploaderHandler = new UploaderHandler();
