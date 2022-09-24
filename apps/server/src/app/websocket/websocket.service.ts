import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class WebsocketService {
  private readonly logger = new Logger(WebsocketService.name);

  private allClients: Map<string, Socket> = new Map<string, Socket>();
  public socketServer: Server = null;

  public create(client: Socket) {
    this.allClients.set(client.id, client);

    this.logger.debug(`Client created: ${client.id}`);
  }

  public destroy(client: Socket) {
    this.allClients.delete(client.id);

    this.logger.debug(`Client destroyed: ${client.id}`);
  }

  public getClients(): Socket[] {
    return [...this.allClients.values()];
  }

  public setServer(server: Server): void {
    this.socketServer = server;

    // this.logger.debug(`Setting server ${JSON.stringify(server.engine)}`);
  }
}
