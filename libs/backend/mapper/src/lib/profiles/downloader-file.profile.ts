import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { DownloaderFileDto } from '@bella/dto';
import { DownloaderFile } from '@bella/db';

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
