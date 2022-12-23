import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { VersionDto } from '@bella/dto';
import { Version } from '@bella/db';

@Injectable()
export class VersionMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        Version,
        VersionDto,
        forMember(
          (d) => d.isCurrent,
          mapFrom((s) => s.isCurrent),
        ),
      );
    };
  }
}
