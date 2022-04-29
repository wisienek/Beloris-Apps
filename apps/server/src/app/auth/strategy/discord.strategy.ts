import 'dotenv/config';
import { PassportStrategy } from '@nestjs/passport';
import { HttpService, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';
import { AuthService } from '../auth.service';

const clientID = 'insert-client-id';
const clientSecret = 'insert-client-secret';
const callbackURL = 'http://localhost:8080/auth/discord';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(private authService: AuthService, private http: HttpService) {
    super({
      authorizationURL: `https://discordapp.com/api/oauth2/authorize?${stringify(
        {
          client_id: process.env.BOT_CLEINTID,
          redirect_uri: process.env.BOT_CALLBACK,
          response_type: 'code',
          scope: 'identify',
        }
      )}`,
      tokenURL: 'https://discordapp.com/api/oauth2/token',
      scope: 'identify',
      clientID: process.env.BOT_CLEINTID,
      clientSecret: process.env.BOT_CLEINTSECRET,
      callbackURL: process.env.BOT_CALLBACK,
    });
  }

  async validate(accessToken: string): Promise<any> {
    const { data } = await this.http
      .get('https://discordapp.com/api/users/@me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise();

    return data;
  }
}
