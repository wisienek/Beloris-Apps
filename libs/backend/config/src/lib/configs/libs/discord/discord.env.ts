import { registerAs } from '@nestjs/config';
import { validateUtil } from '../../../validate.util';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Expose } from 'class-transformer';

export class _DiscordEnv {
  @IsString()
  @IsNotEmpty()
  @Expose()
  BOT_CLIENTID: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl({
    require_tld: false,
  })
  @Expose()
  BOT_REDIRECT_URI: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  BOT_CLIENTSECRET: string;
}

export const DiscordEnv = registerAs('discord', () =>
  validateUtil(process.env, _DiscordEnv),
);
