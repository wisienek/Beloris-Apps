import { ServeStaticModule } from '@nestjs/serve-static';
import { CacheModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';
import { MapperModule } from '@bella/mapper';
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
    MapperModule,
    DataBaseModule,
    AuthModule,
    DiscordModule,
    UpdaterModule,
  ],
})
export class AppModule {}
