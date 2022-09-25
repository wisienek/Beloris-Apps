import {
  ApplicationCommandOptionData,
  ChatInputApplicationCommandData,
  CommandInteraction,
  PermissionResolvable,
} from 'discord.js';

import { DiscordService } from '../discord.service';

export type CommandRunArguments = {
  client: DiscordService;
  message: CommandInteraction;
  args?: string[];
};

export interface Command {
  id?: string;
  name: string;
  description: string;
  options?: ApplicationCommandOptionData[];
  aliases?: string[];
  permission?: PermissionResolvable;
  onlyFor?: string[];
  run: ({ args, client, message }: CommandRunArguments) => void;
  resolve: () => ChatInputApplicationCommandData;
}
