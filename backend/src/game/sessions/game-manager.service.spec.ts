import { describe, expect, it } from 'vitest';

import { parseMapText } from '../maps/map-loader.js';

import { GameManagerService } from './game-manager.service.js';

const MAP_TEXT = [
  '#######',
  '#1.+.2#',
  '#.#.#.#',
  '#.....#',
  '#3...4#',
  '#######',
].join('\n');

function createMap() {
  return parseMapText('test-map', MAP_TEXT);
}

function player(id: string) {
  return {
    id,
    userId: id,
    displayName: id,
  };
}

describe('GameManagerService', () => {
  it('creates and registers a session', () => {
    const manager = new GameManagerService();

    try {
      const session = manager.createSession({
        mode: 'PRIVATE',
        map: createMap(),
        players: [player('alice'), player('bob')],
      });

      expect(session.id.length).toBeGreaterThan(0);
      expect(session.status).toBe('COUNTDOWN');

      expect(manager.getSession(session.id)).toBe(session);
      expect(manager.getActiveSessions()).toContain(session);
    } finally {
      manager.onModuleDestroy();
    }
  });

  it('does not allow a player to join two active games', () => {
    const manager = new GameManagerService();

    try {
      manager.createSession({
        mode: 'PRIVATE',
        map: createMap(),
        players: [player('alice'), player('bob')],
      });

      expect(() =>
        manager.createSession({
          mode: 'PRIVATE',
          map: createMap(),
          players: [player('alice'), player('carol')],
        })
      ).toThrow(/already has an active game/);
    } finally {
      manager.onModuleDestroy();
    }
  });

  it('allows the same players to join another game after finishing', () => {
    const manager = new GameManagerService();

    try {
      const firstGame = manager.createSession({
        mode: 'PRIVATE',
        map: createMap(),
        players: [player('alice'), player('bob')],
      });

      firstGame.status = 'FINISHED';
      firstGame.winnerId = 'alice';

      const secondGame = manager.createSession({
        mode: 'PRIVATE',
        map: createMap(),
        players: [player('alice'), player('bob')],
      });

      expect(secondGame.id).not.toBe(firstGame.id);
      expect(manager.getActiveSessions()).toContain(secondGame);
    } finally {
      manager.onModuleDestroy();
    }
  });

  it('only removes sessions that have finished', () => {
    const manager = new GameManagerService();

    try {
      const session = manager.createSession({
        mode: 'PRIVATE',
        map: createMap(),
        players: [player('alice'), player('bob')],
      });

      expect(manager.removeFinishedSession(session.id)).toBe(false);

      session.status = 'FINISHED';

      expect(manager.removeFinishedSession(session.id)).toBe(true);

      expect(manager.getSession(session.id)).toBeUndefined();
    } finally {
      manager.onModuleDestroy();
    }
  });

  it('starts and stops the game loop with the Nest lifecycle', () => {
    const manager = new GameManagerService();

    try {
      expect(manager.isLoopRunning()).toBe(false);

      manager.onModuleInit();

      expect(manager.isLoopRunning()).toBe(true);
    } finally {
      manager.onModuleDestroy();
    }

    expect(manager.isLoopRunning()).toBe(false);
  });
});
