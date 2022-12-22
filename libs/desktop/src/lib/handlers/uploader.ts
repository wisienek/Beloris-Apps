import axios, { AxiosResponse } from 'axios';
import * as FormData from 'form-data';
import { readFileSync } from 'fs';
import * as _ from 'lodash';
import { VersionType } from '@bella/types';
import { ApiRoutes } from '@bella/data';
import {
  DownloaderFileDto,
  IpcEventDto,
  UploadPackageInfo,
  VersionDto,
} from '@bella/dto';
import { getPackageName, getPackagePath } from '../utils';
import { handlerWrapper } from '../handler-wrapper';
import { readUserSettings } from './user-settings';

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

    const existingVersion = await getExistingVersion(version);

    console.log(
      `${existingVersion ? 'Updating' : 'Uploading'} package data:`,
      packageData,
    );

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
      });

    console.log(`Uploaded package info`, uploadedInfo);

    const formData = new FormData();
    formData.append('file', buffer, getPackageName(version.major));

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
      });

    console.log(`Uploaded package file`, uploadedPackage);

    return null;
  }, `Error while uploading package`);
};

export const uploadFiles = async (): Promise<IpcEventDto<void>> => {
  return await handlerWrapper(async () => {}, `Error while uploading package`);
};

const getExistingVersion: (
  version: VersionType,
) => Promise<VersionDto> = async (version) => {
  const route = ApiRoutes.VERSION_HISTORY;

  const { data: history }: AxiosResponse<VersionDto[]> = await axios.get(route);
  return _.find(
    history ?? [],
    (v) =>
      v.major === version.major &&
      (v.minor === version.minor ||
        ([0, 1].includes(v.minor) && [0, 1].includes(version.minor))),
  );
};
