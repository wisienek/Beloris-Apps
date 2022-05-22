import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import * as DiscordOauth2 from 'discord-oauth2';
import { Strategy } from 'passport-local';
import { Request } from 'express';

import { Cookies } from '@bella/shared';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(request: Request): Promise<DiscordOauth2.User> {
    const token = request.cookies[Cookies.DISCORD_TOKEN];
    if (!token) throw new UnauthorizedException();

    const user = await this.authService.fetchUser(JSON.parse(token));
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
