import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { GameDCLink } from '@bella/db';
import { GameDcLinkDto } from '@bella/dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameDcLinkProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, GameDCLink, GameDcLinkDto);
    };
  }
}
