import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import * as DiscordOauth2 from 'discord-oauth2';
import { Strategy } from 'passport-local';
import { Request } from 'express';

import { CookiesEnum } from '@bella/enums';
import { TokenDto } from '@bella/dto';

import { NoTokenException, NoUserException } from '../errors';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(request: Request): Promise<DiscordOauth2.User> {
    const token = request.cookies[CookiesEnum.DISCORD_TOKEN];
    console.log(token);
    if (!token) throw new NoTokenException(CookiesEnum.DISCORD_TOKEN);

    const parsedToken: TokenDto = JSON.parse(token);
    const user = await this.authService.fetchUser(parsedToken);
    if (!user) throw new NoUserException(parsedToken.state);

    return user;
  }
}
