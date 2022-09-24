import { Global, Module, Provider } from '@nestjs/common';
import { DownloaderFileMapper, VersionMapper } from './profiles';

const services: Provider[] = [DownloaderFileMapper, VersionMapper];

@Global()
@Module({
  providers: services,
  exports: services,
})
export class MapperModule {}
