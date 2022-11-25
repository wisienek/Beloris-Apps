import { ServeStaticModule } from '@nestjs/serve-static';
import { AutomapperModule } from '@automapper/nestjs';
import { CacheModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { classes } from '@automapper/classes';

import { join } from 'path';

import { DataBaseModule } from '@bella/db';

import { DiscordModule } from './discord';
import { UpdaterModule } from './updater';
import { AuthModule } from './auth';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 3600,
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
    UpdaterModule,
  ],
})
export class AppModule {}
