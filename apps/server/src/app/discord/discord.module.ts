import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import { GameDCLink } from '@bella/db';
import { ConfigModuleInternal, DiscordConfig } from '@bella/config';

import { DiscordService } from './discord.service';
import { CommandModule } from './commands';
import { EventsModule } from './events';

@Module({
  imports: [
    ConfigModuleInternal.forConfigs(DiscordConfig),
    TypeOrmModule.forFeature([GameDCLink]),
    forwardRef(() => CommandModule),
    forwardRef(() => EventsModule),
  ],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
