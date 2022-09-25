import { WsException } from '@nestjs/websockets';

export const GatewayErrors = {
  MISSING_TOKEN: new WsException('Missing token'),
  INVALID_TOKEN: new WsException('Invalid token'),
  UNKNOWN_CHANNEL: new WsException('Unknown channel'),
  INVALID_INPUT: new WsException('Invalid input'),
};
