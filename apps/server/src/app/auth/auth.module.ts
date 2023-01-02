import { Global, Module } from '@nestjs/common';
import { ConfigModuleInternal, DiscordConfig } from '@bella/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy';
import { DiscordModule } from '../discord';

@Global()
@Module({
  imports: [ConfigModuleInternal.forConfigs(DiscordConfig), DiscordModule],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
