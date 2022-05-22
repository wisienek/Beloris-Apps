import { Injectable, Logger } from '@nestjs/common';
import { Command } from './commands.interface';
import { KontoService } from './services';

@Injectable()
export class CommandManager {
  private readonly logger = new Logger(CommandManager.name);
  private readonly commands = new Map<string, Command>();

  constructor(private readonly kontoCommand: KontoService) {
    this.commands.set(kontoCommand.name, kontoCommand);
    // this.cmds.forEach((cmd) => this.commands.set(cmd.name, cmd));
  }

  public get(name: string): Command {
    return this.commands.get(name);
  }

  public getCommands(): Map<string, Command> {
    return this.commands;
  }
}
