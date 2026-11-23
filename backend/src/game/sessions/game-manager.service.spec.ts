import { describe, expect, it, vi } from 'vitest';

import type { MapRegistryService } from '../maps/map-registry.service.js';
import type { LoadedMap } from '../maps/map-loader.js';

import { GameManagerService } from './game-manager.service.js';

const testMap: LoadedMap = {
  id: 'map1',
  width: 5,
  height: 5,
  tiles: Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => 'FLOOR' as const)
  ),
  spawnPoints: {
    1: { x: 1, y: 1 },
    2: { x: 3, y: 1 },
    3: { x: 1, y: 3 },
    4: { x: 3, y: 3 },
  },
};

function createGameManager(): GameManagerService {
  const mapRegistry = {
    getMap: vi.fn(() => testMap),
  } as unknown as MapRegistryService;

  return new GameManagerService(mapRegistry);
}

describe('GameManagerService', () => {
  it('releases an eliminated player so they can start another game', () => {
    const gameManager = createGameManager();

    const originalSession = gameManager.createSession({
      mode: 'PRIVATE',
      mapId: 'map1',
      players: [
        {
          id: '101',
          userId: '101',
          displayName: 'Alice',
        },
        {
          id: '102',
          userId: '102',
          displayName: 'Bob',
        },
      ],
    });

    expect(gameManager.getActiveGameIdForUser(101)).toBe(originalSession.id);
    expect(gameManager.hasActiveSessionForUser(101)).toBe(true);
    expect(gameManager.getActiveGameIdForUser(102)).toBe(originalSession.id);

    expect(gameManager.eliminatePlayer(originalSession.id, 101)).toBe(true);

    expect(gameManager.getActiveGameIdForUser(101)).toBeNull();
    expect(gameManager.hasActiveSessionForUser(101)).toBe(false);
    expect(gameManager.getSession(originalSession.id)).toBe(originalSession);
    expect(originalSession.status).toBe('COUNTDOWN');

    // The remaining player is still alive and must remain reserved.
    expect(gameManager.getActiveGameIdForUser(102)).toBe(originalSession.id);
    expect(gameManager.hasActiveSessionForUser(102)).toBe(true);

    expect(() =>
      gameManager.createSession({
        mode: 'PRACTICE',
        mapId: 'map1',
        players: [
          {
            id: '102',
            userId: '102',
            displayName: 'Bob',
          },
        ],
      })
    ).toThrow('Player 102 already has an active game');

    const nextSession = gameManager.createSession({
      mode: 'PRACTICE',
      mapId: 'map1',
      players: [
        {
          id: '101',
          userId: '101',
          displayName: 'Alice',
        },
      ],
    });

    expect(nextSession.id).not.toBe(originalSession.id);
    expect(gameManager.getActiveGameIdForUser(101)).toBe(nextSession.id);
    expect(gameManager.hasActiveSessionForUser(101)).toBe(true);
  });
});
