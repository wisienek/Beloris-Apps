import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';

@Module({
  imports: [AuthModule],
  providers: [WebsocketGateway, WebsocketService],
  exports: [WebsocketService],
})
export class WebSocketModule {}
