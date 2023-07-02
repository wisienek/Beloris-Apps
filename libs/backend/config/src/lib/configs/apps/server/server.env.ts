import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { validateUtil } from '../../../validate.util';
import { Expose } from 'class-transformer';

export class _ServerEnv {
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @Expose()
  APP_PORT: number;

  @IsString()
  @IsNotEmpty()
  @Expose()
  GLOBAL_PREFIX = 'api';

  @IsString()
  @IsNotEmpty()
  @Expose()
  COOKIE_SECRET: string;
}

export const ServerEnv = registerAs('server', () =>
  validateUtil(process.env, _ServerEnv),
);
