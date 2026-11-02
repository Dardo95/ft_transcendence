
import { describe, expect, it, vi } from 'vitest';

import type { MovementInput } from '@transcendence/shared';
import type { Namespace, Socket } from 'socket.io';

import type {
  GamePlayer,
  GameSession,
} from './engine/game-state.js';

import { GameGateway } from './game.gateway.js';

import type { WsJwtAuthService } from '../auth/ws-jwt-auth.service.js';
import type { GameManagerService } from './sessions/game-manager.service.js';
import type { MatchmakingService } from './matchmaking/matchmaking.service.js';

function createPlayer(userId: number): GamePlayer {
  return {
    id: String(userId),
    userId: String(userId),
    displayName: `player-${userId}`,
    isBot: false,

    position: {
      x: 1.5,
      y: 1.5,
    },

    alive: true,

    speedTilesPerSecond: 4,
    bombCapacity: 1,
    blastRadius: 2,

    activeBombIds: new Set<string>(),

    movementInput: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
  };
}

function createSession(userId = 7): GameSession {
  const player = createPlayer(userId);

  const tiles = Array.from(
    { length: 5 },
    () =>
      Array.from(
        { length: 5 },
        () => 'FLOOR' as const
      )
  );

  return {
    id: 'game-1',
    mode: 'PUBLIC',
    status: 'RUNNING',

    board: {
      id: 'map1',
      width: 5,
      height: 5,
      tiles,
      spawnPoints: {},
    },

    players: new Map([
      [player.id, player],
    ]),

    bombs: new Map(),
    explosions: new Map(),
    powerUps: new Map(),

    createdAtMs: 0,
    startedAtMs: 0,
    finishedAtMs: null,

    winnerId: null,
  };
}

function createHarness(session = createSession()) {
  const wsAuth = {
    attach: vi.fn(),
  } as unknown as WsJwtAuthService;

  const matchmaking = {
    requestMatchmaking: vi.fn(() => ({
      mode: 'PUBLIC',
      status: 'SEARCHING',
      queueId: 'queue-1',
      lobbyId: 'lobby-1',
      playerCount: 1,
      playersInCurrentMatch: 0,
    })),

    cancelMatchmaking: vi.fn(() => true),

    subscribeToMatchCreation: vi.fn(() => vi.fn()),

    subscribeToStatusChanges: vi.fn(() => vi.fn()),
  } as unknown as MatchmakingService;

  const gameManager = {
    getSession: vi.fn((gameId: string) =>
      gameId === session.id
        ? session
        : undefined
    ),

    getNowMs: vi.fn(() => 1_000),

    subscribeToTicks: vi.fn(() => vi.fn()),
  } as unknown as GameManagerService;

  const gateway = new GameGateway(
    wsAuth,
    matchmaking,
    gameManager
  );

  const client = {
    id: 'socket-1',

    data: {
      user: {
        id: 7,
        username: 'player-7',
      },

      gameId: session.id,
    },

    emit: vi.fn(),
    join: vi.fn(),
    leave: vi.fn(),
  } as unknown as Socket;

  return {
    gateway,
    wsAuth,
    matchmaking,
    gameManager,
    session,
    client,
  };
}

describe('GameGateway', () => {
  it('passes a validated matchmaking request to MatchmakingService', () => {
    const {
      gateway,
      matchmaking,
      client,
    } = createHarness();

    gateway.handleMatchmaking(client, {
      mode: 'PUBLIC',
      mapId: 'map1',
    });

    expect(
      matchmaking.requestMatchmaking
    ).toHaveBeenCalledWith(
      {
        id: 7,
        username: 'player-7',
      },
      {
        mode: 'PUBLIC',
        mapId: 'map1',
      }
    );

    expect(client.emit).toHaveBeenCalledWith(
      'game:matchmakingStatus',
      expect.objectContaining({
        status: 'SEARCHING',
      })
    );
  });

  it('rejects malformed matchmaking requests', () => {
    const {
      gateway,
      client,
      matchmaking,
    } = createHarness();

    expect(() =>
      gateway.handleMatchmaking(client, {
        mode: 'RANKED',
      })
    ).toThrow();

    expect(
      matchmaking.requestMatchmaking
    ).not.toHaveBeenCalled();
  });

  it('joins an existing session by its UUID and sends a snapshot', async () => {
    const {
      gateway,
      session,
      client,
    } = createHarness();

    const room = {
      emit: vi.fn(),
    };

    gateway.server = {
      to: vi.fn(() => room),
    } as unknown as Namespace;

    await gateway.handleJoinGame(client, {
      gameId: session.id,
    });

    expect(client.join).toHaveBeenCalledWith(
      `match:${session.id}`
    );

    expect(client.emit).toHaveBeenCalledWith(
      'game:joined',
      expect.objectContaining({
        gameId: session.id,

        snapshot: expect.objectContaining({
          gameId: session.id,

          players: [
            expect.objectContaining({
              id: '7',
              displayName: 'player-7',
              speed: 4,
            }),
          ],
        }),
      })
    );
  });

  it("updates the player's continuous movement input", () => {
    const {
      gateway,
      session,
      client,
    } = createHarness();

    const movement: MovementInput = {
      up: true,
      down: false,
      left: true,
      right: false,
    };

    gateway.handleInput(client, {
      action: 'movement',
      input: movement,
    });

    expect(
      session.players.get('7')?.movementInput
    ).toEqual(movement);
  });

  it('stops all movement directions', () => {
    const {
      gateway,
      session,
      client,
    } = createHarness();

    gateway.handleInput(client, {
      action: 'movement',
      input: {
        up: true,
        down: false,
        left: false,
        right: true,
      },
    });

    gateway.handleInput(client, {
      action: 'stop',
    });

    expect(
      session.players.get('7')?.movementInput
    ).toEqual({
      up: false,
      down: false,
      left: false,
      right: false,
    });
  });

  it('places a bomb through the engine instead of relaying the input', () => {
    const {
      gateway,
      session,
      client,
    } = createHarness();

    gateway.handleInput(client, {
      action: 'place-bomb',
    });

    expect(session.bombs.size).toBe(1);

    expect(
      session.players.get('7')?.activeBombIds.size
    ).toBe(1);

    expect(client.emit).toHaveBeenCalledWith(
      'game:bombPlaced',
      expect.objectContaining({
        success: true,
      })
    );
  });

  it('cancels the authenticated user matchmaking request', () => {
    const {
      gateway,
      matchmaking,
      client,
    } = createHarness();

    gateway.handleCancelMatchmaking(client);

    expect(
      matchmaking.cancelMatchmaking
    ).toHaveBeenCalledWith(7);

    expect(client.emit).toHaveBeenCalledWith(
      'game:matchmakingCancelled',
      {
        cancelled: true,
      }
    );
  });
});
