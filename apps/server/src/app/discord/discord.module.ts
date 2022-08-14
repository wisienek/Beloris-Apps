import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import { DiscordService } from './discord.service';
import { CommandModule } from './commands';
import { GameDCLink } from '@bella/db';
import { EventsModule } from './events';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameDCLink]),
    forwardRef(() => CommandModule),
    forwardRef(() => EventsModule),
  ],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
