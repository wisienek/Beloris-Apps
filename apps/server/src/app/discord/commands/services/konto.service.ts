import { GameDCLink } from '@bella/db';
import { Command, CommandRunArguments } from '../commands.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  GuildMember,
  User,
  Permissions,
  ChatInputApplicationCommandData,
} from 'discord.js';

@Injectable()
export class KontoService implements Command {
  public readonly name: string = 'konto';
  public readonly description: string = 'Sprawdza konta połączone z grą';
  public readonly options = [
    {
      type: 6,
      description: '@Kogo sprawdzić (dla adminów)',
      name: 'member',
      required: false,
    },
    {
      type: 3,
      description: 'Kogo sprawdzić (dla adminów)',
      name: 'user',
      required: false,
    },
  ];

  constructor(
    @InjectRepository(GameDCLink)
    private readonly gameDcLinkRepository: Repository<GameDCLink>
  ) {}

  public async run({ message }: CommandRunArguments) {
    const sender = await message.guild.members.fetch(message.user.id);

    const atUser = message.options.getMember('member');
    const nick = message.options.getString('user');

    if (
      (atUser || nick) &&
      !sender.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
    )
      return await message.reply('Brak uprawnień!');

    const connectedAccounts = await this.gameDcLinkRepository.find({
      where: KontoService.resolveWhere(sender, atUser as GuildMember, nick),
    });

    return await message.reply(
      KontoService.listAccountsToString(connectedAccounts)
    );
  }

  private static listAccountsToString(accounts: GameDCLink[]) {
    if (!accounts || accounts.length === 0) return 'Brak połączonych kont!';

    return `Konta <@${accounts[0].discordId}>:\n` + accounts
      .map((link) => `- ${link.playerName} (\`${link.uuid}\`)`)
      .join('\n');
  }

  private static resolveWhere(
    user: User | GuildMember,
    member: GuildMember,
    nick: string
  ): FindOptionsWhere<GameDCLink> {
    if (member) return { discordId: member.id };
    else if (nick) return { playerName: nick };
    else return { discordId: user.id };
  }

  public resolve(): ChatInputApplicationCommandData {
    return {
      type: 'CHAT_INPUT',
      name: this.name,
      description: this.description,
      options: this.options,
      defaultPermission: true,
    };
  }
}
