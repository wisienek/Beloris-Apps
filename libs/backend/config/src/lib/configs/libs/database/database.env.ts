import { registerAs } from '@nestjs/config';
import { validateUtil } from '../../../validate.util';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class _DatabaseEnv {
  @IsString()
  @IsNotEmpty()
  @Expose()
  GAME_DB_HOST: string;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @Expose()
  GAME_DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  @Expose()
  GAME_DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  GAME_DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  GAME_DB_DATABASE: string;
}

export const DatabaseEnv = registerAs('database', () =>
  validateUtil(process.env, _DatabaseEnv),
);
