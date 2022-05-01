import { ServeStaticModule } from '@nestjs/serve-static';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { join } from 'path';

import { configurationSchema } from '@bella/config';
import configuration from '@bella/configuration';
import { DataBaseModule } from '@bella/db';
import { AuthModule } from './auth';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'assets'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configurationSchema,
    }),
    PassportModule.register({
      session: true,
      defaultStrategy: 'local',
    }),
    DataBaseModule,
    AuthModule,
  ],
})
export class AppModule {}
