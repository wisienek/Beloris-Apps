import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { CamelCaseNamingConvention, Mapper } from '@automapper/core';

export abstract class BaseMapper extends AutomapperProfile {
  protected readonly namingConvention = new CamelCaseNamingConvention();

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
