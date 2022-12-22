import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { Module } from '@nestjs/common';
import {
  DownloaderFileMapper,
  GameDcLinkProfile,
  VersionMapper,
} from './profiles';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  providers: [VersionMapper, DownloaderFileMapper, GameDcLinkProfile],
})
export class MapperModule {}
