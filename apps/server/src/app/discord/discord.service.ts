import { Client, Intents } from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';

import { BotConfiguration } from '@bella/config';
import { ServerListEnum } from '@bella/enums';
import { EventManager } from './events';
import { CommandManager } from './commands';

@Injectable()
export class DiscordService extends Client {
  private readonly logger = new Logger(DiscordService.name);

  constructor(
    private readonly config: ConfigService,
    @Inject(forwardRef(() => EventManager))
    public readonly eventManager: EventManager,
    public readonly commandManager: CommandManager, // private readonly commandManager: CommandManager,
  ) {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
      ],
    });

    this.login((this.config.get('bot') as BotConfiguration).secret).then(
      async () => {
        const invite = this.generateInvite({
          scopes: [
            'applications.commands',
            'bot',
            'email',
            'identify',
            'guilds',
          ],
          permissions: ['ADMINISTRATOR'],
        });

        this.logger.debug(`Logged in bot, invite: ${invite}`);
        this.setupEvents();
        await this.setupCommands();
      },
    );
  }

  public async getMember(server: ServerListEnum, memberId: string) {
    const guild = await this.guilds.fetch(server);
    return await guild.members.fetch(memberId);
  }

  public async hasRole(
    server: ServerListEnum,
    roleId: string,
    memberId: string,
  ) {
    const guild = await this.guilds.fetch(server);
    if (!guild) return false;

    const role = await guild.roles.fetch(roleId);
    if (!role) return false;

    const member = await guild.members.fetch(memberId);
    if (!member) return false;

    return member.roles.cache.has(roleId);
  }

  public async hasAllRoles(
    server: ServerListEnum,
    roles: string[],
    memberId: string,
  ) {
    return roles.every(
      async (role) => await this.hasRole(server, role, memberId),
    );
  }

  private setupEvents() {
    this.eventManager.getEvents().forEach((ev) => {
      this.on(ev.name, ev.run.bind(null, this));
    });
  }

  private async setupCommands() {
    this.logger.debug(`Registering commands on servers ...!`);
    await this.guilds.fetch();

    this.logger.debug(`in ${this.guilds.cache.size} guilds ...`);

    const promises = [];

    this.guilds.cache.forEach((guild) => {
      this.commandManager.getCommands().forEach(async (cmd) => {
        this.logger.debug(`Registering command ${cmd.name} on ${guild.name}`);

        promises.push(guild.commands.create(cmd.resolve()));
      });
    });

    await Promise.all(promises).catch((er) => this.logger.error(er));

    this.logger.debug(`Finished registering commands !`);
  }
}
