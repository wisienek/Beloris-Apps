import { Inject, Injectable } from '@nestjs/common';
import { _ProjectEnv, NodeEnv, ProjectEnv } from './project.env';
import { BaseConfig } from '../../base.config';

@Injectable()
export class ProjectConfig extends BaseConfig {
  constructor(
    @Inject(ProjectEnv.KEY)
    protected env: _ProjectEnv
  ) {
    super();
  }

  get node_env() {
    return this.env.NODE_ENV;
  }

  isDev() {
    return this.env.NODE_ENV === NodeEnv.DEV;
  }

  isProd() {
    return this.env.NODE_ENV === NodeEnv.PROD;
  }

  isLocal() {
    return !this.isProd();
  }
}
