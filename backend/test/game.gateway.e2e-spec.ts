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

interface PlayerEventPayload {
  gameId: string;
  userId: number;
}

interface PlayerDisconnectedPayload extends PlayerEventPayload {
  graceMs: number;
}

let app: INestApplication;
let jwtService: JwtService;
let gameManager: GameManagerService;

let socketUrl = '';
let previousMapsDirectory: string | undefined;
let previousDisconnectGraceMs: string | undefined;

const activeSockets = new Set<Socket>();
const TEST_DISCONNECT_GRACE_MS = 400;
let nextTestUserId = 920_000;

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
      reject(new Error(`Socket connection failed: ${error.message}`));
    };

    timer = setTimeout(() => {
      cleanup();
      reject(new Error(`Timeout waiting for Socket.IO event "${event}"`));
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
  const connected = waitForSocketEvent<void>(socket, 'connect', 8_000);

  socket.connect();
  await connected;

  return socket;
}

function makeUser(label: string): TestUser {
  const id = nextTestUserId++;
  return { id, username: `e2e-${label}-${id}` };
}

async function connectPrivateLobby(
  alice: TestUser,
  bob: TestUser
): Promise<void> {
  const lobbyService = app.get(LobbyService);
  lobbyService.createLobby(alice);

  const invitation = lobbyService.createInvitation(alice, bob);
  lobbyService.acceptInvitation(invitation.id, bob);

  const lobby = lobbyService.getLobbyForUser(alice.id);
  expect(lobby).not.toBeNull();
  expect(lobby?.members.map((member) => member.userId).sort()).toEqual([
    alice.id,
    bob.id,
  ]);
}

interface PrivateMatch {
  alice: TestUser;
  bob: TestUser;
  aliceSockets: Socket[];
  bobSocket: Socket;
  gameId: string;
}

async function createPrivateMatch(aliceTabs = 1): Promise<PrivateMatch> {
  const alice = makeUser('alice');
  const bob = makeUser('bob');
  await connectPrivateLobby(alice, bob);

  const aliceSockets = await Promise.all(
    Array.from({ length: aliceTabs }, () => connectAs(alice))
  );
  const bobSocket = await connectAs(bob);

  const aliceFoundPromises = aliceSockets.map((socket) =>
    waitForSocketEvent<GameFoundPayload>(socket, 'game:found', 8_000)
  );
  const bobFoundPromise = waitForSocketEvent<GameFoundPayload>(
    bobSocket,
    'game:found',
    8_000
  );

  aliceSockets[0]!.emit('game:matchmaking', {
    mode: 'PRIVATE',
    mapId: 'map1',
  });

  const [aliceFound, bobFound, ...otherAliceFound] = await Promise.all([
    aliceFoundPromises[0]!,
    bobFoundPromise,
    ...aliceFoundPromises.slice(1),
  ]);

  expect(aliceFound.gameId).toBe(bobFound.gameId);
  expect(aliceFound.playerId).toBe(String(alice.id));
  expect(bobFound.playerId).toBe(String(bob.id));

  for (const found of otherAliceFound) {
    expect(found.gameId).toBe(aliceFound.gameId);
  }

  return {
    alice,
    bob,
    aliceSockets,
    bobSocket,
    gameId: aliceFound.gameId,
  };
}

async function waitForMatchStarted(gameId: string): Promise<void> {
  await waitUntil(() => {
    const session = gameManager.getSession(gameId);
    return (
      session !== undefined &&
      (session.status === 'RUNNING' || session.status === 'OVERTIME')
    );
  }, 7_000);
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

function getPlayerPosition(snapshot: GameSnapshot, userId: number): number {
  const player = snapshot.players.find(
    (candidate) => candidate.id === String(userId)
  );

  if (!player) {
    throw new Error(`Player ${userId} not found in game snapshot`);
  }

  return player.position.x;
}

function isMovementStopped(gameId: string, userId: number): boolean {
  const session = gameManager.getSession(gameId);
  const player = session?.players.get(String(userId));

  if (!player) {
    return false;
  }

  const input = player.movementInput;
  return !input.up && !input.down && !input.left && !input.right;
}

beforeAll(async () => {
  previousMapsDirectory = process.env.MAPS_DIR;
  previousDisconnectGraceMs = process.env.GAME_DISCONNECT_GRACE_MS;

  process.env.MAPS_DIR = fileURLToPath(new URL('../maps/', import.meta.url));
  process.env.GAME_DISCONNECT_GRACE_MS = String(TEST_DISCONNECT_GRACE_MS);

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

  if (previousDisconnectGraceMs === undefined) {
    delete process.env.GAME_DISCONNECT_GRACE_MS;
  } else {
    process.env.GAME_DISCONNECT_GRACE_MS = previousDisconnectGraceMs;
  }
});

describe('GameGateway E2E', () => {
  it('rejects connections without a valid JWT cookie', async () => {
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
  }, 12_000);

  it('rejects non-participants and broadcasts authoritative movement snapshots', async () => {
    const match = await createPrivateMatch();
    const { alice, aliceSockets, bobSocket, gameId } = match;
    const [aliceSocket] = aliceSockets;
    const outsiderSocket = await connectAs(makeUser('outsider'));

    await waitForMatchStarted(gameId);

    const outsiderJoinErrorPromise = waitForSocketEvent<unknown>(
      outsiderSocket,
      'exception',
      5_000
    );
    outsiderSocket.emit('game:join', { gameId });
    const joinError = await outsiderJoinErrorPromise;
    expect(JSON.stringify(joinError)).toContain('participant');

    const session = gameManager.getSession(gameId);
    expect(session).toBeDefined();
    const alicePlayer = session!.players.get(String(alice.id));
    expect(alicePlayer).toBeDefined();
    const initialX = alicePlayer!.position.x;

    const movementUpdatePromise = waitForSocketEvent<GameSnapshot>(
      bobSocket,
      'game:state',
      5_000,
      (snapshot) => {
        const player = snapshot.players.find(
          (candidate) => candidate.id === String(alice.id)
        );
        return player !== undefined && player.position.x > initialX + 0.05;
      }
    );

    aliceSocket!.emit('game:input', {
      action: 'movement',
      input: { up: false, down: false, left: false, right: true },
    });

    const movedSnapshot = await movementUpdatePromise;
    expect(getPlayerPosition(movedSnapshot, alice.id)).toBeGreaterThan(
      initialX
    );

    aliceSocket!.emit('game:input', { action: 'stop' });
    await waitUntil(() => isMovementStopped(gameId, alice.id));

    const stoppedX = alicePlayer!.position.x;
    await delay(150);
    expect(alicePlayer!.position.x).toBeCloseTo(stoppedX, 4);
  }, 20_000);

  it('stops the player during the grace period and restores the session when they reconnect', async () => {
    const match = await createPrivateMatch();
    const { alice, aliceSockets, bobSocket, gameId } = match;
    const [aliceSocket] = aliceSockets;

    await waitForMatchStarted(gameId);

    const session = gameManager.getSession(gameId);
    expect(session).toBeDefined();
    const alicePlayer = session!.players.get(String(alice.id));
    expect(alicePlayer).toBeDefined();

    aliceSocket!.emit('game:input', {
      action: 'movement',
      input: { up: false, down: false, left: false, right: true },
    });
    await waitUntil(() => alicePlayer!.movementInput.right);

    const disconnectedPromise = waitForSocketEvent<PlayerDisconnectedPayload>(
      bobSocket,
      'game:playerDisconnected',
      5_000
    );
    aliceSocket!.disconnect();

    const disconnected = await disconnectedPromise;
    expect(disconnected).toEqual({
      gameId,
      userId: alice.id,
      graceMs: TEST_DISCONNECT_GRACE_MS,
    });

    expect(alicePlayer?.alive).toBe(true);
    expect(isMovementStopped(gameId, alice.id)).toBe(true);

    const reconnectedSocket = await connectAs(alice);
    const joinedPromise = waitForSocketEvent<{ gameId: string }>(
      reconnectedSocket,
      'game:joined',
      5_000
    );
    const reconnectedPromise = waitForSocketEvent<PlayerEventPayload>(
      bobSocket,
      'game:playerReconnected',
      5_000
    );

    reconnectedSocket.emit('game:join', { gameId });

    await Promise.all([joinedPromise, reconnectedPromise]);
    await delay(TEST_DISCONNECT_GRACE_MS + 150);

    expect(alicePlayer?.alive).toBe(true);
    expect(gameManager.getSession(gameId)?.status).toBe('RUNNING');
  }, 20_000);

  it('does not start the grace period while another tab is connected, then eliminates after the final tab disconnects', async () => {
    const match = await createPrivateMatch(2);
    const { alice, bob, aliceSockets, bobSocket, gameId } = match;
    const [firstTab, secondTab] = aliceSockets;

    await waitForMatchStarted(gameId);

    let disconnectedEvents = 0;
    const onDisconnected = () => {
      disconnectedEvents += 1;
    };
    bobSocket.on('game:playerDisconnected', onDisconnected);

    firstTab!.disconnect();
    await delay(TEST_DISCONNECT_GRACE_MS + 150);

    const session = gameManager.getSession(gameId);
    expect(session).toBeDefined();
    expect(session!.players.get(String(alice.id))?.alive).toBe(true);
    expect(disconnectedEvents).toBe(0);

    const disconnectedPromise = waitForSocketEvent<PlayerDisconnectedPayload>(
      bobSocket,
      'game:playerDisconnected',
      5_000
    );
    const playerLeftPromise = waitForSocketEvent<PlayerEventPayload>(
      bobSocket,
      'game:playerLeft',
      5_000
    );
    const finishedPromise = waitForSocketEvent<{ winnerId: string | null }>(
      bobSocket,
      'game:finished',
      5_000
    );

    secondTab!.disconnect();

    const [disconnected, playerLeft, finished] = await Promise.all([
      disconnectedPromise,
      playerLeftPromise,
      finishedPromise,
    ]);

    expect(disconnected.graceMs).toBe(TEST_DISCONNECT_GRACE_MS);
    expect(playerLeft).toEqual({ gameId, userId: alice.id });
    expect(finished.winnerId).toBe(String(bob.id));
    expect(session!.players.get(String(alice.id))?.alive).toBe(false);

    bobSocket.off('game:playerDisconnected', onDisconnected);
  }, 20_000);

  it('eliminates the player immediately when they voluntarily abandon the match', async () => {
    const match = await createPrivateMatch(2);
    const { alice, bob, aliceSockets, bobSocket, gameId } = match;
    const [aliceSocket, secondAliceTab] = aliceSockets;

    await waitForMatchStarted(gameId);

    const session = gameManager.getSession(gameId);
    expect(session).toBeDefined();

    const abandonedPromise = waitForSocketEvent<PlayerEventPayload>(
      bobSocket,
      'game:playerAbandoned',
      5_000
    );
    const finishedPromise = waitForSocketEvent<{ winnerId: string | null }>(
      bobSocket,
      'game:finished',
      5_000
    );

    aliceSocket!.emit('game:abandon');

    const [abandoned, finished] = await Promise.all([
      abandonedPromise,
      finishedPromise,
    ]);

    expect(abandoned).toEqual({ gameId, userId: alice.id });
    expect(finished.winnerId).toBe(String(bob.id));
    expect(session!.players.get(String(alice.id))?.alive).toBe(false);

    // La otra pestaña permanece como espectadora y ya no puede enviar
    // movimientos para el jugador que acaba de abandonar.
    const spectatorInputErrorPromise = waitForSocketEvent<unknown>(
      secondAliceTab!,
      'exception',
      5_000
    );
    secondAliceTab!.emit('game:input', {
      action: 'movement',
      input: { up: false, down: false, left: false, right: true },
    });
    const spectatorInputError = await spectatorInputErrorPromise;
    expect(JSON.stringify(spectatorInputError)).toContain('player first');
  }, 20_000);
});
