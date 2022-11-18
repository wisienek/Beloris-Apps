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
    return this.env.DB_HOST;
  }

  get port() {
    return this.env.DB_PORT;
  }

  get user() {
    return this.env.DB_USERNAME;
  }

  get password() {
    return this.env.DB_PASSWORD;
  }

  get db() {
    return this.env.DB_DATABASE;
  }
}
