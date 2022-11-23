import { ServeStaticModule } from '@nestjs/serve-static';
import { PassportModule } from '@nestjs/passport';
import { CacheModule, Module } from '@nestjs/common';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

import { join } from 'path';

import { DataBaseModule } from '@bella/db';

import { DiscordModule } from './discord';
import { AuthModule } from './auth';
import { WebSocketModule } from './websocket';
import { UpdaterModule } from './updater';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'assets'),
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
