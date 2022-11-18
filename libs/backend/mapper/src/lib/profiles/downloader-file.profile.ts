import { Injectable } from '@nestjs/common';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { DownloaderFile } from '@bella/db';
import { DownloaderFileDto } from '@bella/dto';

@Injectable()
export class DownloaderFileMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, DownloaderFile, DownloaderFileDto);
    };
  }
}
