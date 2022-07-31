import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import * as DiscordOauth2 from 'discord-oauth2';
import { Strategy } from 'passport-local';
import { Request } from 'express';

import { Cookies, TokenDto } from '@bella/shared';

import { AuthService } from '../auth.service';
import { NoTokenException, NoUserException } from '../errors';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(request: Request): Promise<DiscordOauth2.User> {
    const token = request.cookies[Cookies.DISCORD_TOKEN];
    if (!token) throw new NoTokenException(Cookies.DISCORD_TOKEN);

    const parsedToken: TokenDto = JSON.parse(token);
    const user = await this.authService.fetchUser(parsedToken);
    if (!user) throw new NoUserException(parsedToken.state);

    return user;
  }
}
