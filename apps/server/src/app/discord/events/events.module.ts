import { forwardRef, Module } from '@nestjs/common';
import { CommandModule } from '../commands';
import { EventManager } from './event-manager.service';
import { InteractionEvent } from './services';

export const INJECT_EVENTS = 'INJECT_EVENTS';

@Module({
  imports: [forwardRef(() => CommandModule)],
  providers: [
    InteractionEvent,
    {
      provide: INJECT_EVENTS,
      useValue: [InteractionEvent],
    },
    EventManager,
  ],
  exports: [EventManager],
})
export class EventsModule {}
