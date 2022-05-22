import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';

import { Event } from '../event.interface';
import { Interaction } from 'discord.js';
import { DiscordService } from '../../discord.service';
import { CommandManager } from '../../commands';

@Injectable()
export class InteractionEvent implements Event<'interactionCreate'> {
  public readonly name = 'interactionCreate';

  constructor(
    @Inject(forwardRef(() => CommandManager))
    private readonly commandManager: CommandManager
  ) {}

  public getName() {
    return this.name;
  }

  public async run(client: DiscordService, interaction: Interaction) {
    const logger = new Logger(InteractionEvent.name);

    if (!interaction.isCommand()) return;

    // logger.debug(`cmdM: ${!!client.commandManager}, cmd: ${interaction.commandName}`);

    const command = client.commandManager.get(interaction.commandName);
    if (!command)
      return logger.error(
        `Couldn't find command ${interaction.commandName}'`
      );

    try {
      await command.run({ client, message: interaction });
    } catch (er) {
      logger.error(`Error while executing ${interaction.commandName}`, er);
    }
  }
}
