import axios, { AxiosResponse } from 'axios';

import {
  DownloaderFileDto,
  IpcEventDto,
  PackageDataDto,
  UploadPackageInfo,
} from '@bella/dto';
import { VersionType } from '@bella/types';
import { ApiRoutes } from '@bella/data';

import { handlerWrapper } from '../handler-wrapper';
import { readFileSync } from 'fs';
import { readUserSettings } from './user-settings';
import { getPackagePath } from '../utils';

export const uploadPackage = async (
  event,
  version: VersionType,
  packageData: UploadPackageInfo,
): Promise<IpcEventDto<DownloaderFileDto>> => {
  return await handlerWrapper(async () => {
    const { data: userSettings } = await readUserSettings();

    const buffer = readFileSync(
      getPackagePath(userSettings.downloadTo.modpackFolder, version.major),
    );

    const { data: uploadedInfo }: AxiosResponse<DownloaderFileDto> =
      await axios({
        method: 'post',
        url: ApiRoutes.PACKAGE(version.major, version.minor),
        data: packageData,
      });
    console.log(`Uploaded package info`, uploadedInfo);

    const formData = new FormData();
    formData.append('file', new Blob([buffer]));

    const { data: uploadedPackage }: AxiosResponse<DownloaderFileDto> =
      await axios({
        method: 'post',
        url: ApiRoutes.PACKAGE_UPLOAD(
          version.major,
          version.minor,
          uploadedInfo.id,
        ),
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    console.log(`Uploaded package file`, uploadedPackage);

    return null;
  }, `Error while uploading package`);
};

export const uploadFiles = async (): Promise<IpcEventDto<void>> => {
  return await handlerWrapper(async () => {}, `Error while uploading package`);
};
