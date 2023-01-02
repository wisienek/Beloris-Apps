import { Inject, Injectable } from '@nestjs/common';
import { _ServerEnv, ServerEnv } from './server.env';
import { BaseConfig } from '../../../base.config';

@Injectable()
export class ServerConfig extends BaseConfig {
  constructor(
    @Inject(ServerEnv.KEY)
    protected env: _ServerEnv,
  ) {
    super();
  }

  get port() {
    return this.env.APP_PORT;
  }

  get globalPrefix() {
    return this.env.GLOBAL_PREFIX;
  }

  get cookieSecret() {
    return this.env.COOKIE_SECRET;
  }
}
