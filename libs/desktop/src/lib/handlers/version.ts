import axios, { AxiosResponse } from 'axios';
import * as _ from 'lodash';
import { CreateVersionDto, UpdateVersionDto, VersionDto } from '@bella/dto';
import { VersionType } from '@bella/types';
import { ApiRoutes } from '@bella/data';

export const changeVersionAsCurrent: (
  v: VersionType,
  isCurrent: boolean,
) => Promise<VersionDto> = async (version, isCurrent) => {
  console.group(
    `Updating current version to ${version.major}:${version.minor}`,
  );

  const url = ApiRoutes.UPDATE_VERSION(version);
  const data: UpdateVersionDto = {
    isCurrent,
  };

  const { data: updatedVersion }: AxiosResponse<VersionDto> = await axios({
    method: 'patch',
    url,
    data,
  });

  console.log(`Updated version`, updatedVersion);
  console.groupEnd();

  return updatedVersion;
};

export const getExistingVersion: (
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

export const getOrCreateVersion: (
  version: VersionType,
  isCurrent: boolean,
) => Promise<VersionDto> = async (v, isCurrent) => {
  const gotVersion = await getExistingVersion(v);
  if (gotVersion) {
    if (gotVersion.isCurrent !== isCurrent)
      return await changeVersionAsCurrent(v, isCurrent);

    return gotVersion;
  }

  const createVersionUrl = ApiRoutes.VERSION;
  const data: CreateVersionDto = {
    ...v,
    isCurrent,
  };

  const { data: createdVersion }: AxiosResponse<VersionDto> = await axios({
    method: 'post',
    url: createVersionUrl,
    data,
  });

  return createdVersion;
};

export const getVersion: (version: VersionType) => Promise<VersionDto> = async (
  v,
) => {
  const { data: version } = await axios({
    method: 'get',
    url: ApiRoutes.UPDATE_VERSION(v),
  });
  return version;
};
