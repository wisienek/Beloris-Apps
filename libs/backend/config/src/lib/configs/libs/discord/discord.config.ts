import { Inject, Injectable } from '@nestjs/common';
import { BaseConfig } from '../../../base.config';
import { _DiscordEnv, DiscordEnv } from './discord.env';

@Injectable()
export class DiscordConfig extends BaseConfig {
  constructor(
    @Inject(DiscordEnv.KEY)
    protected env: _DiscordEnv,
  ) {
    super();
  }

  get clientId() {
    return this.env.BOT_CLIENTID;
  }

  get redirectUri() {
    return this.env.BOT_REDIRECT_URI;
  }

  get clientSecret() {
    return this.env.BOT_CLIENTSECRET;
  }
}
