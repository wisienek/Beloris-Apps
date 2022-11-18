import {
  createMap,
  forMember,
  Mapper,
  MappingProfile,
  mapWith,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { DownloaderFileDto, FileListDto, VersionDto } from '@bella/dto';
import { DownloaderFile, Version } from '@bella/db';
import { getObjectWithoutProperties } from '@bella/core';

@Injectable()
export class VersionMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Version, VersionDto);

      createMap(
        mapper,
        Version,
        FileListDto,
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
