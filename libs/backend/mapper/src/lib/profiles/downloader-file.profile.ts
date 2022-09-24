import { Injectable } from '@nestjs/common';
import { createMap, MappingProfile, namingConventions } from '@automapper/core';
import { DownloaderFile } from '@bella/db';
import { DownloaderFileDto } from '@bella/dto';
import { BaseMapper } from '../base-mapper';

@Injectable()
export class DownloaderFileMapper extends BaseMapper {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        DownloaderFile,
        DownloaderFileDto,
        namingConventions(this.namingConvention),
      );
    };
  }
}
