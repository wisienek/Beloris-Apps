import { ConfigType } from '@nestjs/config';

export abstract class BaseConfig {
  protected abstract env: ConfigType<any>;
}
