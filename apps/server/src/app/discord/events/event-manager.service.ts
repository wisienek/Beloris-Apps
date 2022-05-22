import { Injectable, Logger } from '@nestjs/common';
import { Event } from './event.interface';
import { ClientEvents } from 'discord.js';
import { InteractionEvent } from './services';

@Injectable()
export class EventManager {
  private readonly logger = new Logger(EventManager.name);
  private readonly events = new Map<string, Event<keyof ClientEvents>>();

  constructor(private readonly interactionCreate: InteractionEvent) {
    this.registerEvent(this.interactionCreate);
  }

  public get(name: keyof ClientEvents): Event<keyof ClientEvents> {
    return this.events.get(name);
  }

  public getEvents(): Map<string, Event<keyof ClientEvents>> {
    return this.events;
  }

  private registerEvent(event: Event<keyof ClientEvents>) {
    this.events.set(event.getName(), event);
  }
}
