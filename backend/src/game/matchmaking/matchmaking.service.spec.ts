import { afterEach, describe, expect, it, vi } from 'vitest';

import type { MatchmakingRequest } from '@transcendence/shared';

import type { WsUser } from '../../auth/ws-jwt-auth.service.js';

import type {
  LobbyMembershipChangedEvent,
  LobbyService,
  LobbySnapshot,
} from '../../lobby/lobby.service.js';

import type {
  CreateManagedGameInput,
  GameManagerService,
} from '../sessions/game-manager.service.js';

import type { MapRegistryService } from '../maps/map-registry.service.js';
import type { GameSession } from '../engine/game-state.js';

import {
  MatchmakingService,
  PUBLIC_MATCH_COUNTDOWN_MS,
  type PublicMatchmakingStatusEvent,
} from './matchmaking.service.js';

function createLobby(id: string, userIds: number[]): LobbySnapshot {
  return {
    id,
    hostUserId: userIds[0],
    createdAt: new Date(0).toISOString(),
    members: userIds.map((userId, index) => ({
      userId,
      username: `player-${userId}`,
      joinedAt: new Date(index).toISOString(),
      isHost: index === 0,
    })),
  };
}

function createHarness(initialLobbies: LobbySnapshot[]) {
  const lobbies = new Map<string, LobbySnapshot>();

  for (const lobby of initialLobbies) {
    lobbies.set(lobby.id, lobby);
  }

  const lobbyByUserId = new Map<number, LobbySnapshot>();

  for (const lobby of initialLobbies) {
    for (const member of lobby.members) {
      lobbyByUserId.set(member.userId, lobby);
    }
  }

  let membershipChangedListener:
    ((event: LobbyMembershipChangedEvent) => void) | undefined;

  const lobbyService = {
    getLobbyForUser: vi.fn(
      (userId: number) => lobbyByUserId.get(userId) ?? null
    ),

    getLobbyById: vi.fn((lobbyId: string) => lobbies.get(lobbyId) ?? null),

    subscribeToMembershipChanges: vi.fn(
      (listener: (event: LobbyMembershipChangedEvent) => void) => {
        membershipChangedListener = listener;

        return () => {
          if (membershipChangedListener === listener) {
            membershipChangedListener = undefined;
          }
        };
      }
    ),
  } as unknown as LobbyService;

  const sessions: Array<{
    id: string;
    mode: string;
    mapId: string;
    players: Array<{
      id: string;
      userId?: string;
      displayName: string;
    }>;
    settings?: MatchmakingRequest['settings'];
  }> = [];

  const createSession = vi.fn((input: CreateManagedGameInput) => {
    const sessionId = `session-${sessions.length + 1}`;

    sessions.push({
      id: sessionId,
      mode: input.mode,
      mapId: input.mapId,
      players: input.players,
      settings: input.settings,
    });

    return {
      id: sessionId,
      mode: input.mode,
      players: new Map(),
    } as unknown as GameSession;
  });

  const gameManager = {
    hasActiveSessionForUser: vi.fn(() => false),
    createSession,
  } as unknown as GameManagerService;

  const mapRegistry = {
    hasMap: vi.fn((mapId: string) => ['map1', 'map2'].includes(mapId)),
  } as unknown as MapRegistryService;

  const service = new MatchmakingService(
    lobbyService,
    gameManager,
    mapRegistry
  );

  return {
    service,
    lobbyService,
    gameManager,
    createSession,
    sessions,
    lobbies,
    lobbyByUserId,

    notifyMembershipChanged: (lobbyId: string, memberIds: number[]) => {
      membershipChangedListener?.({
        lobbyId,
        memberIds,
      });
    },
  };
}

function user(id: number): WsUser {
  return {
    id,
    username: `player-${id}`,
  };
}

function request(
  mode: MatchmakingRequest['mode'],
  mapId = 'map1'
): MatchmakingRequest {
  return {
    mode,
    mapId,
  };
}

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe('MatchmakingService', () => {
  it('keeps a solo public search open until another player arrives', () => {
    vi.useFakeTimers();

    const { service, createSession } = createHarness([
      createLobby('lobby-a', [1]),
    ]);

    const result = service.requestMatchmaking(user(1), request('PUBLIC'));

    expect(result).toMatchObject({
      mode: 'PUBLIC',
      status: 'SEARCHING',
      playerCount: 1,
      playersInCurrentMatch: 0,
    });

    expect(createSession).not.toHaveBeenCalled();

    service.onModuleDestroy();
  });

  it('starts a fixed 15-second countdown when at least two players are matched', async () => {
    vi.useFakeTimers();

    const { service, createSession, sessions } = createHarness([
      createLobby('lobby-a', [1]),
      createLobby('lobby-b', [2]),
    ]);

    service.requestMatchmaking(user(1), request('PUBLIC'));

    const secondResult = service.requestMatchmaking(user(2), request('PUBLIC'));

    expect(secondResult).toMatchObject({
      status: 'COUNTDOWN',
      playersInCurrentMatch: 2,
    });

    expect(
      'countdownEndsAt' in secondResult
        ? secondResult.countdownEndsAt
        : undefined
    ).toBe(Date.now() + PUBLIC_MATCH_COUNTDOWN_MS);

    await vi.advanceTimersByTimeAsync(PUBLIC_MATCH_COUNTDOWN_MS - 1);

    expect(createSession).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);

    expect(sessions).toHaveLength(1);
    expect(sessions[0].mode).toBe('PUBLIC');

    expect(sessions[0].players.map((player) => player.userId)).toEqual([
      '1',
      '2',
    ]);

    service.onModuleDestroy();
  });

  it('does not reset the countdown when another group joins', async () => {
    vi.useFakeTimers();

    const { service, sessions } = createHarness([
      createLobby('lobby-a', [1]),
      createLobby('lobby-b', [2]),
      createLobby('lobby-c', [3]),
    ]);

    service.requestMatchmaking(user(1), request('PUBLIC'));

    service.requestMatchmaking(user(2), request('PUBLIC'));

    await vi.advanceTimersByTimeAsync(5_000);

    const thirdResult = service.requestMatchmaking(user(3), request('PUBLIC'));

    expect(thirdResult.status).toBe('COUNTDOWN');

    expect(
      'countdownEndsAt' in thirdResult ? thirdResult.countdownEndsAt : undefined
    ).toBe(Date.now() + 10_000);

    await vi.advanceTimersByTimeAsync(10_000);

    expect(sessions).toHaveLength(1);
    expect(sessions[0].players).toHaveLength(3);

    service.onModuleDestroy();
  });

  it('never splits a lobby when the complete group does not fit', async () => {
    vi.useFakeTimers();

    const { service, sessions } = createHarness([
      createLobby('lobby-three', [1, 2, 3]),
      createLobby('lobby-two', [4, 5]),
    ]);

    service.requestMatchmaking(user(1), request('PUBLIC'));

    const waitingGroupResult = service.requestMatchmaking(
      user(4),
      request('PUBLIC')
    );

    expect(waitingGroupResult.status).toBe('SEARCHING');

    await vi.advanceTimersByTimeAsync(PUBLIC_MATCH_COUNTDOWN_MS);

    expect(sessions).toHaveLength(1);

    expect(sessions[0].players.map((player) => player.userId)).toEqual([
      '1',
      '2',
      '3',
    ]);

    const secondGroupStatus = service.requestMatchmaking(
      user(4),
      request('PUBLIC')
    );

    expect(secondGroupStatus.status).toBe('COUNTDOWN');

    expect(
      'playersInCurrentMatch' in secondGroupStatus
        ? secondGroupStatus.playersInCurrentMatch
        : undefined
    ).toBe(2);

    await vi.advanceTimersByTimeAsync(PUBLIC_MATCH_COUNTDOWN_MS);

    expect(sessions).toHaveLength(2);

    expect(sessions[1].players.map((player) => player.userId)).toEqual([
      '4',
      '5',
    ]);

    service.onModuleDestroy();
  });

  it('creates private matches immediately with the complete lobby', () => {
    const { service, createSession } = createHarness([
      createLobby('lobby-private', [1, 2, 3]),
    ]);

    const result = service.requestMatchmaking(user(1), request('PRIVATE'));

    expect(result).toMatchObject({
      mode: 'PRIVATE',
      status: 'CREATED',
    });

    expect(createSession).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'PRIVATE',
        players: [
          {
            id: '1',
            userId: '1',
            displayName: 'player-1',
          },
          {
            id: '2',
            userId: '2',
            displayName: 'player-2',
          },
          {
            id: '3',
            userId: '3',
            displayName: 'player-3',
          },
        ],
      })
    );

    service.onModuleDestroy();
  });

  it('forwards private match settings to session creation', () => {
    const { service, createSession } = createHarness([
      createLobby('lobby-private', [1, 2]),
    ]);

    const settings = {
      initialBombs: 2,
      initialSpeed: 3,
      fuseTime: 4,
    };

    service.requestMatchmaking(user(1), {
      ...request('PRIVATE'),
      settings,
    });

    expect(createSession).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'PRIVATE',
        settings,
      })
    );

    service.onModuleDestroy();
  });

  it('rejects private match settings outside the allowed range', () => {
    const { service } = createHarness([createLobby('lobby-private', [1, 2])]);

    expect(() =>
      service.requestMatchmaking(user(1), {
        ...request('PRIVATE'),
        settings: {
          initialBombs: 8,
          initialSpeed: 1,
          fuseTime: 3,
        },
      })
    ).toThrow(/initialBombs/);

    service.onModuleDestroy();
  });

  it('creates a practice match with one human; the engine factory adds the bot', () => {
    const { service, createSession } = createHarness([
      createLobby('lobby-a', [1]),
    ]);

    const result = service.requestMatchmaking(user(1), request('PRACTICE'));

    expect(result).toMatchObject({
      mode: 'PRACTICE',
      status: 'CREATED',
    });

    expect(createSession).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'PRACTICE',
        players: [
          {
            id: '1',
            userId: '1',
            displayName: 'player-1',
          },
        ],
      })
    );

    service.onModuleDestroy();
  });

  it('cancels the complete public lobby group instead of splitting it', () => {
    vi.useFakeTimers();

    const { service, createSession } = createHarness([
      createLobby('lobby-a', [1, 2]),
    ]);

    service.requestMatchmaking(user(1), request('PUBLIC'));

    expect(service.cancelMatchmaking(2)).toBe(true);

    const retry = service.requestMatchmaking(user(1), request('PUBLIC'));

    expect(retry.status).toBe('COUNTDOWN');

    expect('playerCount' in retry ? retry.playerCount : undefined).toBe(2);

    expect(createSession).not.toHaveBeenCalled();

    service.onModuleDestroy();
  });

  it('cancels a queued group when its lobby membership changes', async () => {
    vi.useFakeTimers();

    const { service, createSession, notifyMembershipChanged } = createHarness([
      createLobby('lobby-a', [1, 2]),
    ]);

    service.requestMatchmaking(user(1), request('PUBLIC'));

    notifyMembershipChanged('lobby-a', [1]);

    expect(service.cancelMatchmaking(1)).toBe(false);
    expect(service.cancelMatchmaking(2)).toBe(false);

    await vi.advanceTimersByTimeAsync(PUBLIC_MATCH_COUNTDOWN_MS);

    expect(createSession).not.toHaveBeenCalled();

    service.onModuleDestroy();
  });

  it('notifies every matched lobby when the public countdown starts', () => {
    vi.useFakeTimers();

    const { service } = createHarness([
      createLobby('lobby-a', [1]),
      createLobby('lobby-b', [2]),
    ]);

    const events: PublicMatchmakingStatusEvent[] = [];

    const unsubscribe = service.subscribeToStatusChanges((event) => {
      events.push(event);
    });

    service.requestMatchmaking(user(1), request('PUBLIC'));

    service.requestMatchmaking(user(2), request('PUBLIC'));

    const countdownEvents = events.filter(
      (event) => event.status === 'COUNTDOWN'
    );

    expect(countdownEvents.map((event) => event.lobbyId).sort()).toEqual([
      'lobby-a',
      'lobby-b',
    ]);

    expect(
      countdownEvents.every((event) => event.playersInCurrentMatch === 2)
    ).toBe(true);

    unsubscribe();
    service.onModuleDestroy();
  });

  it('notifies the complete lobby when its public search is cancelled', () => {
    vi.useFakeTimers();

    const { service } = createHarness([createLobby('lobby-a', [1, 2])]);

    const events: PublicMatchmakingStatusEvent[] = [];

    const unsubscribe = service.subscribeToStatusChanges((event) => {
      events.push(event);
    });

    service.requestMatchmaking(user(1), request('PUBLIC'));

    service.cancelMatchmaking(1);

    expect(events.at(-1)).toMatchObject({
      status: 'CANCELLED',
      lobbyId: 'lobby-a',
      userIds: [1, 2],
    });

    unsubscribe();
    service.onModuleDestroy();
  });
});
