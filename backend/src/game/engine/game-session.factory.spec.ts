import { describe, expect, it } from 'vitest';

import { parseMapText } from '../maps/map-loader.js';
import { placeBomb } from './bomb-system.js';
import { createGameSession } from './game-session.factory.js';

const MAP_TEXT = [
  '#######',
  '#1.+.2#',
  '#.#.#.#',
  '#.....#',
  '#3...4#',
  '#######',
].join('\n');

const map = () => parseMapText('test-map', MAP_TEXT);

const player = (id: string) => ({
  id,
  userId: id,
  displayName: id,
});

describe('createGameSession', () => {
  it('creates a public match with two humans', () => {
    const session = createGameSession({
      id: 'game-1',
      mode: 'PUBLIC',
      map: map(),
      players: [player('alice'), player('bob')],
      nowMs: 1000,
    });

    expect(session.status).toBe('COUNTDOWN');
    expect(session.createdAtMs).toBe(1000);
    expect(session.startedAtMs).toBeNull();

    expect(session.players.size).toBe(2);
    expect(session.players.get('alice')?.isBot).toBe(false);
    expect(session.players.get('bob')?.isBot).toBe(false);

    expect(session.players.get('alice')?.position).toEqual({ x: 1.5, y: 1.5 });

    expect(session.players.get('bob')?.position).toEqual({ x: 5.5, y: 4.5 });

    expect(session.bombs.size).toBe(0);
    expect(session.explosions.size).toBe(0);
    expect(session.powerUps.size).toBe(0);
  });

  it('creates one human and a stationary bot in practice', () => {
    const session = createGameSession({
      id: 'practice-1',
      mode: 'PRACTICE',
      map: map(),
      players: [player('alice')],
    });

    expect(session.players.size).toBe(2);

    const human = session.players.get('alice');
    const bot = session.players.get('practice-1:bot');

    expect(human?.isBot).toBe(false);
    expect(bot?.isBot).toBe(true);
    expect(bot?.userId).toBeUndefined();
    expect(bot?.displayName).toBe('Chef Bot');

    expect(human?.position).toEqual({ x: 1.5, y: 1.5 });
    expect(bot?.position).toEqual({ x: 5.5, y: 4.5 });

    expect(human?.alive).toBe(true);
    expect(bot?.alive).toBe(true);
  });

  it('creates a private match with four players', () => {
    const session = createGameSession({
      id: 'private-1',
      mode: 'PRIVATE',
      map: map(),
      players: [
        player('alice'),
        player('bob'),
        player('carol'),
        player('dave'),
      ],
    });

    expect(session.players.size).toBe(4);
    expect([...session.players.values()].every((p) => !p.isBot)).toBe(true);
  });

  it('applies lobby settings to players and bomb fuses', () => {
    const session = createGameSession({
      id: 'private-settings',
      mode: 'PRIVATE',
      map: map(),
      players: [player('alice'), player('bob')],
      settings: {
        initialBombs: 2,
        initialSpeed: 3,
        fuseTime: 5,
      },
      nowMs: 1000,
    });

    for (const participant of session.players.values()) {
      expect(participant.bombCapacity).toBe(2);
      expect(participant.speedTilesPerSecond).toBe(6);
    }

    expect(session.settings.bombFuseMs).toBe(5_000);

    session.status = 'RUNNING';
    const placement = placeBomb(session, 'alice', 'bomb-settings', 2_000);

    expect(placement.success).toBe(true);

    if (placement.success) {
      expect(placement.detonateAtMs).toBe(7_000);
    }
  });

  it('keeps backend defaults when no lobby settings are provided', () => {
    const session = createGameSession({
      id: 'private-defaults',
      mode: 'PRIVATE',
      map: map(),
      players: [player('alice'), player('bob')],
      nowMs: 1000,
    });

    expect(session.players.get('alice')?.bombCapacity).toBe(1);
    expect(session.players.get('alice')?.speedTilesPerSecond).toBe(4);
    expect(session.settings.bombFuseMs).toBe(2_500);
  });

  it('rejects a private match with only one player', () => {
    expect(() =>
      createGameSession({
        id: 'private-2',
        mode: 'PRIVATE',
        map: map(),
        players: [player('alice')],
      })
    ).toThrow(/between 2 and 4 players/);
  });

  it('rejects practice without exactly one human', () => {
    expect(() =>
      createGameSession({
        id: 'practice-2',
        mode: 'PRACTICE',
        map: map(),
        players: [player('alice'), player('bob')],
      })
    ).toThrow(/exactly one human player/);
  });

  it('rejects duplicated participant IDs', () => {
    expect(() =>
      createGameSession({
        id: 'game-2',
        mode: 'PUBLIC',
        map: map(),
        players: [player('alice'), player('alice')],
      })
    ).toThrow(/unique/);
  });
});
