import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { parse } from 'querystring';

import * as DiscordOauth2 from 'discord-oauth2';
import * as crypto from 'crypto';
import * as _ from 'lodash';

import { Cookies, ServerListEnum, TokenDto } from '@bella/shared';
import { BotConfiguration } from '@bella/config';

@Injectable()
export class AuthService {
  public static readonly UserScope = [
    'identify',
    'guilds',
    'guilds.members.read',
  ];

  private readonly logger = new Logger(AuthService.name);
  private discordConfig: BotConfiguration;
  private oauth: DiscordOauth2;

  constructor(private config: ConfigService) {
    this.discordConfig = this.config.get('bot');

    this.oauth = new DiscordOauth2({
      clientId: this.discordConfig.id,
      clientSecret: this.discordConfig.secret,
      redirectUri: this.discordConfig.callback,
    });
  }

  public async login() {
    return this.oauth.generateAuthUrl({
      responseType: 'token',
      scope: AuthService.UserScope,
      state: crypto.randomBytes(16).toString('hex'),
    });
  }

  public async validate(
    request: Request,
    response: Response,
  ): Promise<DiscordOauth2.User> {
    if (!request.body || _.isEmpty(request.body) || !request.body.hash)
      throw new BadRequestException(`No request provided!`);

    const { hash } = request.body as { hash: string };
    const parsedQuery = parse(hash.replace('#', ''));

    if (parsedQuery.error) throw new BadRequestException(parsedQuery);

    const token = new TokenDto(parsedQuery);

    const user = await this.fetchUser(token);

    response.cookie(Cookies.DISCORD_TOKEN, JSON.stringify(token), {
      maxAge: token.expires_in,
      signed: false,
    });

    this.logger.log(`Logged in user: ${user.username}#${user.discriminator}`);

    return user;
  }

  public async fetchUser(token: TokenDto): Promise<DiscordOauth2.User> {
    if (!token) throw new UnauthorizedException(`No token!`);

    return await this.oauth.getUser(token.access_token);
  }

  public async fetchMember(
    token: TokenDto,
    server: ServerListEnum,
  ): Promise<DiscordOauth2.Member> {
    if (!token) throw new UnauthorizedException(`No token!`);
    if (!server) throw new BadRequestException(`No ServerID provided!`);

    return await this.oauth.getGuildMember(token.access_token, server);
  }

  public verify(token: TokenDto | Request): Promise<DiscordOauth2.User> {
    if (!token) return null;

    return this.fetchUser(
      'headers' in token
        ? AuthService.getTokenFromRequest(token as Request)
        : token,
    );
  }

  public async verifyAccessToken(token: string) {
    if (!token) return null;

    return await this.fetchUser({ access_token: token } as TokenDto);
  }

  public static getTokenFromRequest(request: Request): TokenDto {
    const cookie = request.cookies[Cookies.DISCORD_TOKEN];
    if (!cookie) return null;

    return JSON.parse(cookie) as TokenDto;
  }
}
