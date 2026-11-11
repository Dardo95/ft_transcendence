import {
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
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
import type {
  GameSnapshot,
  MatchmakingRequest,
  MovementInput,
} from '@transcendence/shared';
import { randomUUID } from 'node:crypto';
import type { Namespace, Socket } from 'socket.io';

import { WsJwtAuthService, type WsUser } from '../auth/ws-jwt-auth.service.js';
import { ChatGateway } from '../chat/chat.gateway.js';
import { websocketOptions } from '../realtime/websocket-options.js';

import { placeBomb } from './engine/bomb-system.js';
import type { GameTickResult } from './engine/game-engine.js';
import type { GameSession } from './engine/game-state.js';
import { setPlayerMovementInput } from './engine/movement-system.js';

import {
  MatchmakingService,
  type MatchCreatedEvent,
  type PublicMatchmakingStatusEvent,
} from './matchmaking/matchmaking.service.js';

import { GameManagerService } from './sessions/game-manager.service.js';

type GameSocketData = {
  user?: WsUser;
  gameId?: string;
  spectator?: boolean;
};

type Direction = 'up' | 'down' | 'left' | 'right';

type GameInput =
  | { action: 'move'; direction: Direction }
  | { action: 'movement'; input: MovementInput }
  | { action: 'stop' }
  | { action: 'place-bomb' }
  | { action: 'place-pot' };

const STOPPED_MOVEMENT: MovementInput = {
  up: false,
  down: false,
  left: false,
  right: false,
};

@WebSocketGateway({
  namespace: '/game',
  ...websocketOptions,
})
export class GameGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(GameGateway.name);

  @WebSocketServer()
  server!: Namespace;

  private requestingSocketId?: string;

  private unsubscribeFromMatchCreation?: () => void;
  private unsubscribeFromMatchmakingStatus?: () => void;
  private unsubscribeFromGameTicks?: () => void;

  constructor(
    private readonly wsAuth: WsJwtAuthService,
    private readonly matchmaking: MatchmakingService,
    private readonly gameManager: GameManagerService,
    private readonly chatGateway: ChatGateway
  ) {}

  afterInit(server: Namespace): void {
    this.wsAuth.attach(server);
  }

  onModuleInit(): void {
    this.unsubscribeFromMatchCreation =
      this.matchmaking.subscribeToMatchCreation((event) => {
        void this.handleMatchCreated(event).catch((error: unknown) => {
          this.logger.error(
            `Could not notify players about game ${event.session.id}: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        });
      });

    this.unsubscribeFromMatchmakingStatus =
      this.matchmaking.subscribeToStatusChanges((event) => {
        this.emitMatchmakingStatus(event);
      });

    this.unsubscribeFromGameTicks = this.gameManager.subscribeToTicks(
      (session, result) => {
        this.handleGameTick(session, result);
      }
    );
  }

  onModuleDestroy(): void {
    this.unsubscribeFromMatchCreation?.();
    this.unsubscribeFromMatchmakingStatus?.();
    this.unsubscribeFromGameTicks?.();
  }

  // --------------------------------------------------
  // MATCHMAKING
  // --------------------------------------------------

  @SubscribeMessage('game:matchmaking')
  handleMatchmaking(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown
  ): void {
    const user = this.getAuthenticatedUser(client);
    const request = this.parseMatchmakingRequest(body);

    this.requestingSocketId = client.id;

    try {
      const result = this.matchmaking.requestMatchmaking(user, request);

      if (result.mode === 'PUBLIC') {
        client.emit('game:matchmakingStatus', result);
        return;
      }

      client.emit('game:matchmakingStatus', {
        mode: result.mode,
        status: 'CREATED',
        gameId: result.session.id,
      });
    } finally {
      this.requestingSocketId = undefined;
    }
  }

  @SubscribeMessage('game:cancelMatchmaking')
  handleCancelMatchmaking(@ConnectedSocket() client: Socket): void {
    const user = this.getAuthenticatedUser(client);

    const cancelled = this.matchmaking.cancelMatchmaking(user.id);

    client.emit('game:matchmakingCancelled', {
      cancelled,
    });
  }

  // --------------------------------------------------
  // JOIN / RECONNECTION
  // --------------------------------------------------

  @SubscribeMessage('game:join')
  async handleJoinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown
  ): Promise<void> {
    const user = this.getAuthenticatedUser(client);
    const gameId = this.readString(body, 'gameId');
    const spectator = this.readBoolean(body, 'spectator');

    if (!gameId) {
      throw new WsException('A valid game ID is required');
    }

    const session = this.gameManager.getSession(gameId);

    if (!session || session.status === 'FINISHED') {
      throw new WsException('Game not found or already finished');
    }

    const player = this.findHumanPlayer(session, user.id);

    if (!spectator && !player) {
      throw new WsException('You are not a participant in this game');
    }

    const data = client.data as GameSocketData;

    if (data.gameId && data.gameId !== gameId) {
      if (!data.spectator) {
        this.stopPlayerMovement(data.gameId, user.id);
      }

      await client.leave(`match:${data.gameId}`);
    }

    await client.join(`match:${gameId}`);

    data.gameId = gameId;
    data.spectator = spectator;

    client.emit('game:joined', {
      gameId,
      spectator,
      snapshot: this.toGameSnapshot(session),
    });

    if (!spectator) {
      this.server.to(`match:${gameId}`).emit('game:playerJoined', {
        gameId,
        userId: user.id,
        username: user.username,
      });
    }
  }

  // --------------------------------------------------
  // GAME INPUT
  // --------------------------------------------------

  @SubscribeMessage('game:input')
  handleInput(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown
  ): void {
    const user = this.getAuthenticatedUser(client);
    const data = client.data as GameSocketData;
    const gameId = data.gameId;

    if (!gameId) {
      throw new WsException('Join a game first');
    }

    const session = this.gameManager.getSession(gameId);

    if (!session || session.status === 'FINISHED') {
      throw new WsException('Game is not active');
    }

    const player = this.findHumanPlayer(session, user.id);

    if (!player) {
      throw new WsException('You are not a participant in this game');
    }

    const input = this.parseInput(body);

    // Colocación de bombas.
    if (input.action === 'place-bomb' || input.action === 'place-pot') {
      const result = placeBomb(
        session,
        player.id,
        randomUUID(),
        this.gameManager.getNowMs()
      );

      if (!result.success) {
        client.emit('game:inputRejected', {
          action: 'place-bomb',
          reason: result.reason,
        });

        return;
      }

      client.emit('game:bombPlaced', result);

      return;
    }

    // Movimiento continuo.
    let movement: MovementInput;

    if (input.action === 'movement') {
      movement = input.input;
    } else if (input.action === 'stop') {
      movement = STOPPED_MOVEMENT;
    } else {
      movement = {
        up: input.direction === 'up',
        down: input.direction === 'down',
        left: input.direction === 'left',
        right: input.direction === 'right',
      };
    }

    const result = setPlayerMovementInput(session, player.id, movement);

    if (!result.success) {
      client.emit('game:inputRejected', {
        action: 'movement',
        reason: result.reason,
      });
    }
  }

  // --------------------------------------------------
  // DISCONNECTION
  // --------------------------------------------------

  handleDisconnect(client: Socket): void {
    const data = client.data as GameSocketData;
    const user = data.user;
    const gameId = data.gameId;

    if (!user || !gameId || !this.server) {
      return;
    }

    // Un espectador no participa en la partida: no movemos ni anunciamos
    // su salida como si fuera un jugador.
    if (data.spectator) {
      return;
    }

    // Si el usuario tiene otra conexión activa en esta
    // misma partida, no detenemos su movimiento.
    const anotherSocketIsConnected = [...this.server.sockets.values()].some(
      (socket) => {
        if (socket.id === client.id) {
          return false;
        }

        const otherData = socket.data as GameSocketData;

        return otherData.user?.id === user.id && otherData.gameId === gameId;
      }
    );

    if (anotherSocketIsConnected) {
      return;
    }

    this.stopPlayerMovement(gameId, user.id);

    this.server.to(`match:${gameId}`).emit('game:playerLeft', {
      gameId,
      userId: user.id,
    });
  }

  // --------------------------------------------------
  // MATCH CREATION
  // --------------------------------------------------

  private async handleMatchCreated(event: MatchCreatedEvent): Promise<void> {
    if (!this.server) {
      return;
    }

    const { session, userIds } = event;

    const allowedUsers = new Set(userIds);
    const room = `match:${session.id}`;

    const snapshot = this.toGameSnapshot(session);

    // Unir automáticamente a todos los jugadores conectados.
    for (const socket of this.server.sockets.values()) {
      const data = socket.data as GameSocketData;
      const user = data.user;

      if (!user || !allowedUsers.has(user.id)) {
        continue;
      }

      if (data.gameId && data.gameId !== session.id) {
        this.stopPlayerMovement(data.gameId, user.id);

        await socket.leave(`match:${data.gameId}`);
      }

      await socket.join(room);

      data.gameId = session.id;

      socket.emit('game:found', {
        gameId: session.id,
        mode: session.mode,
        playerId: String(user.id),
        snapshot,
      });
    }

    // La partida acaba de empezar: los amigos deben pasar a `in_game`.
    await Promise.all(
      userIds.map((userId) =>
        this.chatGateway.notifyFriendsStatus(userId, true)
      )
    );
  }

  // --------------------------------------------------
  // MATCHMAKING NOTIFICATIONS
  // --------------------------------------------------

  private emitMatchmakingStatus(event: PublicMatchmakingStatusEvent): void {
    if (!this.server) {
      return;
    }

    const { userIds, ...payload } = event;

    const allowedUsers = new Set(userIds);

    for (const socket of this.server.sockets.values()) {
      const user = (socket.data as GameSocketData).user;

      if (
        user &&
        allowedUsers.has(user.id) &&
        socket.id !== this.requestingSocketId
      ) {
        socket.emit('game:matchmakingStatus', payload);
      }
    }
  }

  // --------------------------------------------------
  // GAME LOOP / SNAPSHOTS
  // --------------------------------------------------

  private handleGameTick(session: GameSession, result: GameTickResult): void {
    if (!this.server) {
      return;
    }

    const snapshot = this.toGameSnapshot(session);

    const room = this.server.to(`match:${session.id}`);

    // Estado autoritativo actualizado.
    room.emit('game:state', snapshot);

    if (result.started) {
      room.emit('game:started', {
        gameId: session.id,
        snapshot,
      });
    }

    if (result.outcome?.newlyFinished) {
      room.emit('game:finished', {
        gameId: session.id,
        winnerId: session.winnerId,
        snapshot,
      });

      // La sesión ya está FINISHED: los jugadores vuelven a `online`.
      const userIds = [...session.players.values()]
        .filter((player) => !player.isBot && player.userId)
        .map((player) => Number(player.userId));

      void Promise.all(
        userIds.map((userId) =>
          this.chatGateway.notifyFriendsStatus(userId, true)
        )
      );
    }
  }

  private toGameSnapshot(session: GameSession): GameSnapshot {
    const nowMs = this.gameManager.getNowMs();

    return {
      gameId: session.id,
      mode: session.mode,
      status: session.status,

      elapsedMs:
        session.startedAtMs === null
          ? 0
          : Math.max(0, nowMs - session.startedAtMs),

      board: {
        width: session.board.width,
        height: session.board.height,
        tiles: session.board.tiles.map((row) => [...row]),
      },

      players: [...session.players.values()].map((player) => ({
        id: player.id,
        displayName: player.displayName,
        isBot: player.isBot,
        position: { ...player.position },
        alive: player.alive,
        bombCapacity: player.bombCapacity,
        blastRadius: player.blastRadius,
        speed: player.speedTilesPerSecond,
      })),

      bombs: [...session.bombs.values()].map((bomb) => ({
        id: bomb.id,
        ownerId: bomb.ownerId,
        position: { ...bomb.position },
        detonateAt: bomb.detonateAtMs,
        blastRadius: bomb.blastRadius,
      })),

      explosions: [...session.explosions.values()].map((explosion) => ({
        id: explosion.id,
        cells: explosion.cells.map((cell) => ({ ...cell })),
        expiresAt: explosion.expiresAtMs,
      })),

      powerUps: [...session.powerUps.values()].map((powerUp) => ({
        id: powerUp.id,
        type: powerUp.type,
        position: { ...powerUp.position },
      })),

      winnerId: session.winnerId,
    };
  }

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  private findHumanPlayer(session: GameSession, userId: number) {
    const expectedUserId = String(userId);

    return [...session.players.values()].find(
      (player) =>
        !player.isBot && (player.userId ?? player.id) === expectedUserId
    );
  }

  private stopPlayerMovement(gameId: string, userId: number): void {
    const session = this.gameManager.getSession(gameId);

    if (!session) {
      return;
    }

    const player = this.findHumanPlayer(session, userId);

    if (player) {
      player.movementInput = { ...STOPPED_MOVEMENT };
    }
  }

  private getAuthenticatedUser(client: Socket): WsUser {
    const user = (client.data as GameSocketData).user;

    if (!user) {
      throw new WsException('Unauthorized');
    }

    return user;
  }

  private parseMatchmakingRequest(body: unknown): MatchmakingRequest {
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      throw new WsException('Invalid matchmaking request');
    }

    const value = body as Record<string, unknown>;

    if (
      typeof value.mapId !== 'string' ||
      !value.mapId.trim() ||
      !['PUBLIC', 'PRIVATE', 'PRACTICE'].includes(value.mode as string)
    ) {
      throw new WsException('Invalid matchmaking request');
    }

    if (
      value.settings !== undefined &&
      (typeof value.settings !== 'object' ||
        value.settings === null ||
        Array.isArray(value.settings))
    ) {
      throw new WsException('Invalid matchmaking settings');
    }

    return {
      mapId: value.mapId.trim(),
      mode: value.mode as MatchmakingRequest['mode'],
      ...(value.settings !== undefined
        ? {
            settings: value.settings as MatchmakingRequest['settings'],
          }
        : {}),
    };
  }

  private parseInput(body: unknown): GameInput {
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      throw new WsException('Invalid game input');
    }

    const value = body as Record<string, unknown>;

    // Compatibilidad con el movimiento direccional anterior.
    if (
      value.action === 'move' &&
      ['up', 'down', 'left', 'right'].includes(value.direction as string)
    ) {
      return {
        action: 'move',
        direction: value.direction as Direction,
      };
    }

    // Movimiento continuo con las cuatro teclas.
    if (value.action === 'movement') {
      const movement = value.input;

      if (
        typeof movement === 'object' &&
        movement !== null &&
        !Array.isArray(movement) &&
        ['up', 'down', 'left', 'right'].every(
          (key) =>
            typeof (movement as Record<string, unknown>)[key] === 'boolean'
        )
      ) {
        const input = movement as Record<string, boolean>;

        return {
          action: 'movement',
          input: {
            up: input.up,
            down: input.down,
            left: input.left,
            right: input.right,
          },
        };
      }
    }

    if (value.action === 'stop') {
      return { action: 'stop' };
    }

    if (value.action === 'place-bomb') {
      return { action: 'place-bomb' };
    }

    // Compatibilidad con el nombre antiguo.
    if (value.action === 'place-pot') {
      return { action: 'place-pot' };
    }

    throw new WsException('Invalid game input');
  }

  private readString(body: unknown, key: string): string {
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return '';
    }

    const value = (body as Record<string, unknown>)[key];

    return typeof value === 'string' ? value.trim() : '';
  }

  private readBoolean(body: unknown, key: string): boolean {
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return false;
    }

    return (body as Record<string, unknown>)[key] === true;
  }
}
