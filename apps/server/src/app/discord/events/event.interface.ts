import { ClientEvents } from 'discord.js';

import { DiscordService } from '../discord.service';

export interface Event<T extends keyof ClientEvents> {
  name: T;
  run: (client: DiscordService, ...args: ClientEvents[T]) => void;
  getName: () => string;
}
