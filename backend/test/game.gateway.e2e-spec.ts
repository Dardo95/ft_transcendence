
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { io, type Socket } from 'socket.io-client';
import type { AddressInfo } from 'node:net';
import { fileURLToPath } from 'node:url';

import type { GameSnapshot } from '@transcendence/shared';

import { GameModule } from '../src/game/game.module.js';
import { PrismaService } from '../src/database/prisma.service.js';
import { LobbyService } from '../src/lobby/lobby.service.js';
import { GameManagerService } from '../src/game/sessions/game-manager.service.js';

interface TestUser {
  id: number;
  username: string;
}

interface GameFoundPayload {
  gameId: string;
  mode: string;
  playerId: string;
  snapshot: GameSnapshot;
}

interface GameStartedPayload {
  gameId: string;
  snapshot: GameSnapshot;
}

interface MatchmakingStatusPayload {
  mode: string;
  status: string;
  gameId?: string;
}

interface PlayerLeftPayload {
  gameId: string;
  userId: number;
}

const ALICE: TestUser = {
  id: 910001,
  username: 'e2e-alice',
};

const BOB: TestUser = {
  id: 910002,
  username: 'e2e-bob',
};

const OUTSIDER: TestUser = {
  id: 910003,
  username: 'e2e-outsider',
};

let app: INestApplication;
let jwtService: JwtService;
let gameManager: GameManagerService;

let socketUrl = '';

let previousMapsDirectory: string | undefined;

const activeSockets = new Set<Socket>();

function waitForSocketEvent<T>(
  socket: Socket,
  event: string,
  timeoutMs = 5_000,
  predicate: (payload: T) => boolean = () => true
): Promise<T> {
  return new Promise((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout>;

    const cleanup = () => {
      clearTimeout(timer);
      socket.off(event, onEvent);
      socket.off('connect_error', onConnectError);
    };

    const onEvent = (payload: T) => {
      if (!predicate(payload)) {
        return;
      }

      cleanup();
      resolve(payload);
    };

    const onConnectError = (error: Error) => {
      cleanup();

      reject(
        new Error(`Socket connection failed: ${error.message}`)
      );
    };

    timer = setTimeout(() => {
      cleanup();

      reject(
        new Error(`Timeout waiting for Socket.IO event "${event}"`)
      );
    }, timeoutMs);

    socket.on(event, onEvent);

    if (event !== 'connect_error') {
      socket.once('connect_error', onConnectError);
    }
  });
}

function createSocket(token?: string): Socket {
  const socket = io(socketUrl, {
    autoConnect: false,
    forceNew: true,
    reconnection: false,
    transports: ['websocket'],
    timeout: 5_000,
    ...(token
      ? {
          extraHeaders: {
            Cookie: `access_token=${token}`,
          },
        }
      : {}),
  });

  activeSockets.add(socket);

  return socket;
}

async function connectAs(user: TestUser): Promise<Socket> {
  const token = await jwtService.signAsync({
    sub: user.id,
    username: user.username,
  });

  const socket = createSocket(token);

  const connected = waitForSocketEvent<void>(
    socket,
    'connect',
    8_000
  );

  socket.connect();

  await connected;

  return socket;
}

async function connectPrivateLobby(): Promise<void> {
  const lobbyService = app.get(LobbyService);

  lobbyService.createLobby(ALICE);

  const invitation = lobbyService.createInvitation(
    ALICE,
    BOB
  );

  lobbyService.acceptInvitation(
    invitation.id,
    BOB
  );

  const lobby = lobbyService.getLobbyForUser(ALICE.id);

  expect(lobby).not.toBeNull();
  expect(lobby?.members.map((member) => member.userId).sort())
    .toEqual([ALICE.id, BOB.id]);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitUntil(
  condition: () => boolean,
  timeoutMs = 3_000
): Promise<void> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (condition()) {
      return;
    }

    await delay(10);
  }

  throw new Error('Timed out waiting for the expected server state');
}

function getPlayerPosition(
  snapshot: GameSnapshot,
  userId: number
): number {
  const player = snapshot.players.find(
    (candidate) => candidate.id === String(userId)
  );

  if (!player) {
    throw new Error(`Player ${userId} not found in game snapshot`);
  }

  return player.position.x;
}

function isMovementStopped(
  gameId: string,
  userId: number
): boolean {
  const session = gameManager.getSession(gameId);

  const player = session?.players.get(String(userId));

  if (!player) {
    return false;
  }

  const input = player.movementInput;

  return (
    !input.up &&
    !input.down &&
    !input.left &&
    !input.right
  );
}

beforeAll(async () => {
  previousMapsDirectory = process.env.MAPS_DIR;

  process.env.MAPS_DIR = fileURLToPath(
    new URL('../maps/', import.meta.url)
  );

  const moduleFixture = await Test.createTestingModule({
    imports: [GameModule],
  })
    .overrideProvider(PrismaService)
    .useValue({
      onModuleInit: async () => undefined,
      onModuleDestroy: async () => undefined,
    })
    .compile();

  app = moduleFixture.createNestApplication();

  await app.listen(0, '127.0.0.1');

  const address = app.getHttpServer().address() as AddressInfo | null;

  if (!address || typeof address === 'string') {
    throw new Error('Could not determine the E2E server address');
  }

  socketUrl = `http://127.0.0.1:${address.port}/game`;

  jwtService = app.get(JwtService);
  gameManager = app.get(GameManagerService);
});

afterEach(() => {
  for (const socket of activeSockets) {
    socket.disconnect();
  }

  activeSockets.clear();
});

afterAll(async () => {
  for (const socket of activeSockets) {
    socket.disconnect();
  }

  activeSockets.clear();

  if (app) {
    await app.close();
  }

  if (previousMapsDirectory === undefined) {
    delete process.env.MAPS_DIR;
  } else {
    process.env.MAPS_DIR = previousMapsDirectory;
  }
});

describe('GameGateway E2E', () => {
  it(
    'rejects connections without a valid JWT cookie',
    async () => {
      for (const token of [undefined, 'invalid-jwt-token']) {
        const socket = createSocket(token);

        const connectionError = waitForSocketEvent<Error>(
          socket,
          'connect_error',
          5_000
        );

        socket.connect();

        const error = await connectionError;

        expect(error.message).toContain('Unauthorized');
        expect(socket.connected).toBe(false);

        socket.disconnect();
      }
    },
    12_000
  );

  it(
    'creates a private match, broadcasts snapshots, processes movement and stops it on disconnect',
    async () => {
      await connectPrivateLobby();

      const aliceSocket = await connectAs(ALICE);
      const bobSocket = await connectAs(BOB);
      const outsiderSocket = await connectAs(OUTSIDER);

      const aliceFoundPromise =
        waitForSocketEvent<GameFoundPayload>(
          aliceSocket,
          'game:found',
          8_000
        );

      const bobFoundPromise =
        waitForSocketEvent<GameFoundPayload>(
          bobSocket,
          'game:found',
          8_000
        );

      const matchmakingStatusPromise =
        waitForSocketEvent<MatchmakingStatusPayload>(
          aliceSocket,
          'game:matchmakingStatus',
          5_000
        );

      aliceSocket.emit('game:matchmaking', {
        mode: 'PRIVATE',
        mapId: 'map1',
      });

      const status = await matchmakingStatusPromise;

      expect(status).toMatchObject({
        mode: 'PRIVATE',
        status: 'CREATED',
      });

      const [aliceFound, bobFound] = await Promise.all([
        aliceFoundPromise,
        bobFoundPromise,
      ]);

      expect(aliceFound.gameId).toBe(bobFound.gameId);

      expect(aliceFound.gameId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );

      expect(aliceFound.playerId).toBe(String(ALICE.id));
      expect(bobFound.playerId).toBe(String(BOB.id));

      expect(aliceFound.snapshot.players).toHaveLength(2);
      expect(bobFound.snapshot.players).toHaveLength(2);

      const gameId = aliceFound.gameId;

      expect(status.gameId).toBe(gameId);

      // Un usuario autenticado que no pertenece a la partida
      // no debe poder incorporarse mediante game:join.
      const outsiderJoinErrorPromise =
        waitForSocketEvent<unknown>(
          outsiderSocket,
          'exception',
          5_000
        );

      outsiderSocket.emit('game:join', {
        gameId,
      });

      const joinError = await outsiderJoinErrorPromise;

      expect(JSON.stringify(joinError))
        .toContain('participant');

      // Ambos jugadores deben recibir snapshots reales
      // procedentes de la sala Socket.IO de la partida.
      const aliceStatePromise =
        waitForSocketEvent<GameSnapshot>(
          aliceSocket,
          'game:state',
          5_000
        );

      const bobStatePromise =
        waitForSocketEvent<GameSnapshot>(
          bobSocket,
          'game:state',
          5_000
        );

      const [aliceState, bobState] = await Promise.all([
        aliceStatePromise,
        bobStatePromise,
      ]);

      expect(aliceState.gameId).toBe(gameId);
      expect(bobState.gameId).toBe(gameId);

      expect(aliceState.players).toHaveLength(2);
      expect(bobState.players).toHaveLength(2);

      // Esperar al final de la cuenta atrás real del motor.
      const aliceStartedPromise =
        waitForSocketEvent<GameStartedPayload>(
          aliceSocket,
          'game:started',
          7_000
        );

      const bobStartedPromise =
        waitForSocketEvent<GameStartedPayload>(
          bobSocket,
          'game:started',
          7_000
        );

      const [aliceStarted, bobStarted] = await Promise.all([
        aliceStartedPromise,
        bobStartedPromise,
      ]);

      expect(aliceStarted.gameId).toBe(gameId);
      expect(bobStarted.gameId).toBe(gameId);

      expect(aliceStarted.snapshot.status).toBe('RUNNING');
      expect(bobStarted.snapshot.status).toBe('RUNNING');

      const initialX = getPlayerPosition(
        aliceStarted.snapshot,
        ALICE.id
      );

      // Enviar movimiento desde Alice y comprobar que
      // Bob recibe la posición actualizada por el servidor.
      const movementUpdatePromise =
        waitForSocketEvent<GameSnapshot>(
          bobSocket,
          'game:state',
          5_000,
          (snapshot) => {
            const player = snapshot.players.find(
              (candidate) => candidate.id === String(ALICE.id)
            );

            return (
              player !== undefined &&
              player.position.x > initialX + 0.05
            );
          }
        );

      aliceSocket.emit('game:input', {
        action: 'movement',
        input: {
          up: false,
          down: false,
          left: false,
          right: true,
        },
      });

      const movedSnapshot = await movementUpdatePromise;

      const movedX = getPlayerPosition(
        movedSnapshot,
        ALICE.id
      );

      expect(movedX).toBeGreaterThan(initialX);

      // Comprobar la parada de movimiento por input.
      aliceSocket.emit('game:input', {
        action: 'stop',
      });

      await waitUntil(
        () => isMovementStopped(gameId, ALICE.id)
      );

      const session = gameManager.getSession(gameId);

      expect(session).toBeDefined();

      const alicePlayer = session!.players.get(
        String(ALICE.id)
      );

      expect(alicePlayer).toBeDefined();

      const stoppedX = alicePlayer!.position.x;

      await delay(150);

      expect(alicePlayer!.position.x).toBeCloseTo(
        stoppedX,
        4
      );

      // Volver a movernos para comprobar que desconectar
      // el socket también detiene el movimiento.
      const movementBeforeDisconnect =
        waitForSocketEvent<GameSnapshot>(
          bobSocket,
          'game:state',
          5_000,
          (snapshot) => {
            const player = snapshot.players.find(
              (candidate) => candidate.id === String(ALICE.id)
            );

            return (
              player !== undefined &&
              player.position.x > stoppedX + 0.05
            );
          }
        );

      aliceSocket.emit('game:input', {
        action: 'movement',
        input: {
          up: false,
          down: false,
          left: false,
          right: true,
        },
      });

      const movingSnapshot = await movementBeforeDisconnect;

      expect(
        getPlayerPosition(movingSnapshot, ALICE.id)
      ).toBeGreaterThan(stoppedX);

      const playerLeftPromise =
        waitForSocketEvent<PlayerLeftPayload>(
          bobSocket,
          'game:playerLeft',
          5_000
        );

      aliceSocket.disconnect();

      const playerLeft = await playerLeftPromise;

      expect(playerLeft).toEqual({
        gameId,
        userId: ALICE.id,
      });

      await waitUntil(
        () => isMovementStopped(gameId, ALICE.id)
      );

      const positionAtDisconnect =
        alicePlayer!.position.x;

      await delay(150);

      expect(alicePlayer!.position.x).toBeCloseTo(
        positionAtDisconnect,
        4
      );
    },
    20_000
  );
});
