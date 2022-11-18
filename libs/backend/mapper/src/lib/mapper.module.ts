import { Module } from '@nestjs/common';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { DownloaderFileMapper, VersionMapper } from './profiles';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  providers: [VersionMapper, DownloaderFileMapper],
})
export class MapperModule {}
