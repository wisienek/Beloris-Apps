import {
  createMap,
  forMember,
  MappingProfile,
  mapWith,
  namingConventions,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';

import { BaseMapper } from '../base-mapper';

import { DownloaderFileDto, FileListDto, VersionDto } from '@bella/dto';
import { DownloaderFile, Version } from '@bella/db';
import { getObjectWithoutProperties } from '@bella/core';

@Injectable()
export class VersionMapper extends BaseMapper {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        Version,
        VersionDto,
        namingConventions(this.namingConvention),
      );

      createMap(
        mapper,
        Version,
        FileListDto,
        namingConventions(this.namingConvention),
        forMember(
          (d) => d.version,
          mapWith(VersionDto, Version, (s) =>
            getObjectWithoutProperties(s, ['files']),
          ),
        ),
        forMember(
          (d) => d.files,
          mapWith(DownloaderFileDto, DownloaderFile, (s) => s.files),
        ),
      );
    };
  }
}
