import { ServeStaticModule } from '@nestjs/serve-static';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

import { join } from 'path';

import { configurationSchema } from '@bella/config';
import configuration from '@bella/configuration';
import { DataBaseModule } from '@bella/db';

import { DiscordModule } from './discord';
import { AuthModule } from './auth';
import { WebSocketModule } from './websocket';
import { UpdaterModule } from './updater';

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
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    DataBaseModule,
    AuthModule,
    DiscordModule,
    WebSocketModule,
    UpdaterModule,
  ],
})
export class AppModule {}
