import { existsSync, readFileSync } from 'fs';
import axios, { AxiosResponse } from 'axios';
import * as FormData from 'form-data';
import { resolve } from 'path';
import { VersionType } from '@bella/types';
import { ApiRoutes } from '@bella/data';
import {
  DownloaderFileDto,
  FileUploadDto,
  IpcEventDto,
  UploadPackageInfo,
} from '@bella/dto';
import { getPackageName, getPackagePath } from '../utils';
import { handlerWrapper } from '../handler-wrapper';
import { readUserSettings } from './user-settings';
import { getOrCreateVersion } from './version';

export const uploadPackage = async (
  version: VersionType,
  packageData: UploadPackageInfo,
  setCurrentVersion?: boolean,
): Promise<IpcEventDto<DownloaderFileDto>> => {
  return await handlerWrapper(async () => {
    const { data: userSettings } = await readUserSettings();

    const buffer = readFileSync(
      getPackagePath(userSettings.downloadTo.modpackFolder, version.major),
    );

    const existingVersion = await getOrCreateVersion(
      version,
      setCurrentVersion,
    );

    console.group(
      `${existingVersion ? 'Updating' : 'Uploading'} package data:`,
    );
    console.log(packageData);

    const { data: uploadedInfo }: AxiosResponse<DownloaderFileDto> =
      await axios({
        method: existingVersion ? 'patch' : 'post',
        url: existingVersion
          ? ApiRoutes.PACKAGE_EDIT(
              version.major,
              version.minor,
              existingVersion.id,
            )
          : ApiRoutes.PACKAGE(version.major, version.minor),
        data: packageData,
        withCredentials: true,
      });

    console.log(`Uploaded package info`, uploadedInfo);
    console.groupEnd();

    const packageName = getPackageName(version.major);
    const formData = new FormData();
    formData.append('file', buffer, packageName);

    console.group(`Sending file ${packageName}`);
    const { data: uploadedPackage }: AxiosResponse<DownloaderFileDto> =
      await axios({
        method: 'post',
        url: ApiRoutes.PACKAGE_UPLOAD(
          version.major,
          version.minor,
          uploadedInfo.id,
        ),
        data: formData,
        headers: formData.getHeaders(),
        withCredentials: true,
      });

    console.log(`Uploaded package file:`, uploadedPackage);
    console.groupEnd();

    return uploadedPackage;
  }, `Error while uploading package`);
};

export const uploadFiles = async (
  version: VersionType,
  filesData: Array<FileUploadDto>,
  setCurrentVersion?: boolean,
): Promise<IpcEventDto<Array<DownloaderFileDto>>> => {
  return await handlerWrapper(async () => {
    const { data: userSettings } = await readUserSettings();

    await getOrCreateVersion(version, setCurrentVersion);

    const fileDataPostUrl = ApiRoutes.FILE_LIST(version.major, version.minor);

    const preparedRequests = [];

    console.log(`Sending ${filesData.length} files to server!`);

    for (const fileData of filesData) {
      console.log(`File ${fileData.name}`);

      const filePath = resolve(
        userSettings.downloadTo.modpackFolder,
        fileData.savePath,
      );

      console.log(`File path: ${filePath}`);

      if (!existsSync(filePath))
        throw new Error(`Plik ${fileData.name} nie mógł być znaleziony!`);

      const buffer = readFileSync(filePath);

      // TODO: add check post/path based on get version files
      preparedRequests.push(
        axios({
          method: 'post',
          url: fileDataPostUrl,
          data: fileData,
          withCredentials: true,
        }).then(
          async ({ data: dFileData }: AxiosResponse<DownloaderFileDto>) => {
            console.log(`Received data:`, dFileData);

            const sendFileUrl = ApiRoutes.FILE_LIST_UPLOAD(
              version,
              dFileData.id,
            );

            console.log(`Sending file for data: ${dFileData.name}`);

            const formData = new FormData();
            formData.append('file', buffer, dFileData.name);

            const { data }: AxiosResponse<DownloaderFileDto> = await axios({
              method: 'post',
              url: sendFileUrl,
              data: formData,
              headers: formData.getHeaders(),
              withCredentials: true,
            });

            console.log(`File sent successfully!`, data);

            return data;
          },
        ),
      );
    }

    return await Promise.all(preparedRequests);
  }, `Error while uploading package`);
};
