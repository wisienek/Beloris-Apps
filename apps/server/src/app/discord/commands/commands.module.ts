import { Module } from '@nestjs/common';
import { KontoService } from './services';
import { CommandManager } from './command-manager.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameDCLink } from '@bella/db';

export const COMMANDS_INJECT = 'COMMANDS_INJECT';

// TODO: custom injector for multiple commands
export const CommandsProvider = {
  provide: COMMANDS_INJECT,
  useValue: [KontoService],
};

@Module({
  imports: [TypeOrmModule.forFeature([GameDCLink])],
  providers: [KontoService, CommandManager],
  exports: [CommandManager],
})
export class CommandModule {}
