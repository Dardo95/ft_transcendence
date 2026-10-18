import { randomUUID } from 'node:crypto';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import type { Namespace, Socket } from 'socket.io';

import {
  WsJwtAuthService,
  type WsUser,
} from '../auth/ws-jwt-auth.service.js';
import { websocketOptions } from '../realtime/websocket-options.js';

@WebSocketGateway({
  namespace: '/chat',
  ...websocketOptions,
})
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Namespace;

  constructor(private readonly wsAuth: WsJwtAuthService) {}

  afterInit(server: Namespace): void {
    this.wsAuth.attach(server);
  }

  @SubscribeMessage('chat:send')
  handleSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown,
  ): void {
    const text =
      typeof body === 'object' &&
      body !== null &&
      'text' in body &&
      typeof body.text === 'string'
        ? body.text.trim()
        : '';

    if (!text || text.length > 500) {
      throw new WsException('Invalid message');
    }

    const user = client.data.user as WsUser;

    const message = {
      id: randomUUID(),
      senderId: user.id,
      sender: user.username,
      text,
      timestamp: new Date().toISOString(),
    };

    // El servidor distribuye el mensaje a todos los conectados al chat.
    this.server.emit('chat:message', message);
  }
}