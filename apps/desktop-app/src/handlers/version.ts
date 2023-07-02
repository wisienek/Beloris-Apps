import { AxiosResponse } from 'axios';
import * as _ from 'lodash';
import { CreateVersionDto, UpdateVersionDto, VersionDto } from '@bella/dto';
import { VersionType } from '@bella/types';
import { ApiRoutes } from '@bella/data';
import { BaseHandler } from './base-handler';

class VersionHandler extends BaseHandler {
  constructor() {
    super(VersionHandler.name);
  }

  public async changeVersionAsCurrent(version: VersionType, isCurrent: boolean): Promise<VersionDto> {
    this.logger.log(`Updating current version to ${version.major}:${version.minor}`);

    const url = ApiRoutes.UPDATE_VERSION(version);
    const data: UpdateVersionDto = {
      isCurrent,
    };

    const { data: updatedVersion }: AxiosResponse<VersionDto> = await this.axiosInstance.patch(url, data);

    this.logger.log(`Updated version`, updatedVersion);

    return updatedVersion;
  }

  public async getExistingVersion(version: VersionType): Promise<VersionDto> {
    const route = ApiRoutes.VERSION_HISTORY;

    const { data: history }: AxiosResponse<VersionDto[]> = await this.axiosInstance.get(route);
    return _.find(
      history ?? [],
      (v) =>
        v.major === version.major &&
        (v.minor === version.minor || ([0, 1].includes(v.minor) && [0, 1].includes(version.minor))),
    );
  }

  public async getOrCreateVersion(version: VersionType, isCurrent: boolean): Promise<VersionDto> {
    const gotVersion = await this.getExistingVersion(version);
    if (gotVersion) {
      if (gotVersion.isCurrent !== isCurrent) return await this.changeVersionAsCurrent(version, isCurrent);

      return gotVersion;
    }

    const createVersionUrl = ApiRoutes.VERSION;
    const data: CreateVersionDto = {
      ...version,
      isCurrent,
    };

    const { data: createdVersion }: AxiosResponse<VersionDto> = await this.axiosInstance.post(createVersionUrl, data);

    return createdVersion;
  }

  public async getVersion(v: VersionType): Promise<VersionDto> {
    const { data: version } = await this.axiosInstance.get(ApiRoutes.UPDATE_VERSION(v));
    return version;
  }
}

export const versionHandler = new VersionHandler();
