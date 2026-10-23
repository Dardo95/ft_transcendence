import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import type { Namespace, Socket } from 'socket.io';

import { WsJwtAuthService, type WsUser } from '../auth/ws-jwt-auth.service.js';
import { PrismaService } from '../database/prisma.service.js';
import { websocketOptions } from '../realtime/websocket-options.js';

type GameInput =
  | { action: 'move'; direction: 'up' | 'down' | 'left' | 'right' }
  | { action: 'place-pot' };

type GameSocketData = {
  user: WsUser;
  matchId?: number;
};

@WebSocketGateway({
  namespace: '/game',
  ...websocketOptions,
})
export class GameGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Namespace;

  constructor(
    private readonly wsAuth: WsJwtAuthService,
    private readonly prisma: PrismaService
  ) {}

  afterInit(server: Namespace): void {
    this.wsAuth.attach(server);
  }

  @SubscribeMessage('game:join')
  async joinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown
  ): Promise<void> {
    const matchId =
      typeof body === 'object' &&
      body !== null &&
      'matchId' in body &&
      typeof body.matchId === 'number'
        ? body.matchId
        : NaN;

    if (!Number.isSafeInteger(matchId) || matchId <= 0) {
      throw new WsException('Invalid match ID');
    }

    const data = client.data as GameSocketData;
    const user = data.user;

    // Comprobar que el usuario pertenece a esta partida.
    const player = await this.prisma.matchPlayer.findUnique({
      where: {
        matchId_userId: {
          matchId,
          userId: user.id,
        },
      },
      select: {
        matchId: true,
        match: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!player || player.match.status === 'FINISHED') {
      throw new WsException('Cannot join this match');
    }

    // Un socket solo puede estar unido a una partida a la vez.
    if (data.matchId !== undefined) {
      await client.leave(`match:${data.matchId}`);
    }

    await client.join(`match:${matchId}`);
    data.matchId = matchId;

    client.emit('game:joined', { matchId });

    this.server.to(`match:${matchId}`).emit('game:playerJoined', {
      matchId,
      userId: user.id,
      username: user.username,
    });
  }

  @SubscribeMessage('game:input')
  handleInput(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown
  ): void {
    const data = client.data as GameSocketData;
    const user = data.user;
    const matchId = data.matchId;

    if (matchId === undefined) {
      throw new WsException('Join a match first');
    }

    const input = this.parseInput(body);

    // Es un relay inicial para probar los eventos.
    // La simulación autoritativa del juego se implementará en un servicio.
    this.server.to(`match:${matchId}`).emit('game:input', {
      userId: user.id,
      input,
    });
  }

  handleDisconnect(client: Socket): void {
    const data = client.data as Partial<GameSocketData>;

    if (data.matchId !== undefined && data.user) {
      this.server.to(`match:${data.matchId}`).emit('game:playerLeft', {
        matchId: data.matchId,
        userId: data.user.id,
      });
    }
  }

  private parseInput(body: unknown): GameInput {
    if (typeof body !== 'object' || body === null) {
      throw new WsException('Invalid game input');
    }

    const input = body as Record<string, unknown>;

    if (
      input.action === 'move' &&
      ['up', 'down', 'left', 'right'].includes(input.direction as string)
    ) {
      return {
        action: 'move',
        direction: input.direction as 'up' | 'down' | 'left' | 'right',
      };
    }

    if (input.action === 'place-pot') {
      return { action: 'place-pot' };
    }

    throw new WsException('Invalid game input');
  }
}
