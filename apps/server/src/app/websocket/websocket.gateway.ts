import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayErrors } from './errors';
import { ExtendedError } from 'socket.io/dist/namespace';
// import { TokenService }
import { Logger } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { BaseWebsocketConfig } from './types';
import { AuthService } from '../auth';

@WebSocketGateway({
  ...BaseWebsocketConfig,
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly socketService: WebsocketService,
    private authService: AuthService,
  ) {}

  @WebSocketServer() server: Server;
  private readonly logger = new Logger(WebsocketGateway.name);

  afterInit(server: Server) {
    this.logger.log('Gateway init!');
    this.socketService.setServer(server);

    server.use((socket, next) => this.authenticateSocket(socket, next));
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.socketService.destroy(client);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.socketService.create(client);
  }

  authenticateSocket(socket: Socket, next: (err?: ExtendedError) => void) {
    const token = socket.handshake.auth.token;
    if (!token) next(GatewayErrors.MISSING_TOKEN);

    try {
      this.authService.verifyAccessToken(token);
      next();
    } catch (error) {
      next(GatewayErrors.INVALID_TOKEN);
    }
  }
}
