import { registerAs } from '@nestjs/config';
import { validateUtil } from '../../../validate.util';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class _DatabaseEnv {
  @IsString()
  @IsNotEmpty()
  @Expose()
  DB_HOST: string;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @Expose()
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  @Expose()
  DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  DB_DATABASE: string;
}

export const DatabaseEnv = registerAs('database', () =>
  validateUtil(process.env, _DatabaseEnv),
);
