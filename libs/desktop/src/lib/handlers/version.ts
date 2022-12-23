import axios, { AxiosResponse } from 'axios';
import { UpdateVersionDto, VersionDto } from '@bella/dto';
import { VersionType } from '@bella/types';
import { ApiRoutes } from '@bella/data';

export const changeVersionAsCurrent: (
  v: VersionType,
) => Promise<VersionDto> = async (version) => {
  console.group(`Updating current version to ${version.major}:${version.minor}`);

  const url = ApiRoutes.UPDATE_VERSION(version);
  const data: UpdateVersionDto = {
    isCurrent: true,
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
