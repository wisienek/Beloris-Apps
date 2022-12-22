import { Inject, Injectable } from '@nestjs/common';
import { _DatabaseEnv, DatabaseEnv } from './database.env';
import { BaseConfig } from '../../../base.config';

@Injectable()
export class DatabaseConfig extends BaseConfig {
  constructor(
    @Inject(DatabaseEnv.KEY)
    protected env: _DatabaseEnv,
  ) {
    super();
  }

  get host() {
    return this.env.GAME_DB_HOST;
  }

  get port() {
    return this.env.GAME_DB_PORT;
  }

  get user() {
    return this.env.GAME_DB_USERNAME;
  }

  get password() {
    return this.env.GAME_DB_PASSWORD;
  }

  get db() {
    return this.env.GAME_DB_DATABASE;
  }
}
