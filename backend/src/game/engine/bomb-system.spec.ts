import { describe, expect, it } from 'vitest';

import { parseMapText } from '../maps/map-loader.js';
import { createGameSession } from './game-session.factory.js';
import { placeBomb } from './bomb-system.js';

const MAP_TEXT = [
  '#######',
  '#1.+.2#',
  '#.#.#.#',
  '#.....#',
  '#3...4#',
  '#######',
].join('\n');

function createRunningSession() {
  const map = parseMapText('test-map', MAP_TEXT);

  const session = createGameSession({
    id: 'game-test',
    mode: 'PRIVATE',
    map,
    players: [
      { id: 'alice', displayName: 'Alice' },
      { id: 'bob', displayName: 'Bob' },
    ],
  });

  session.status = 'RUNNING';

  return session;
}

describe('placeBomb', () => {
  it('places a bomb in the player tile', () => {
    const session = createRunningSession();

    const result = placeBomb(session, 'alice', 'bomb-1', 1000);

    expect(result.success).toBe(true);

    const bomb = session.bombs.get('bomb-1')!;

    expect(bomb.position).toEqual({ x: 1, y: 1 });
    expect(bomb.ownerId).toBe('alice');
    expect(bomb.placedAtMs).toBe(1000);
    expect(bomb.detonateAtMs).toBe(1000 + 2500);

    expect(session.players.get('alice')?.activeBombIds.has('bomb-1')).toBe(
      true
    );

    expect(bomb.passThroughPlayerIds.has('alice')).toBe(true);
  });

  it('does not place two bombs in the same tile', () => {
    const session = createRunningSession();

    expect(placeBomb(session, 'alice', 'bomb-1', 1000).success).toBe(true);

    expect(placeBomb(session, 'alice', 'bomb-2', 1001)).toEqual({
      success: false,
      reason: 'BOMB_ALREADY_PRESENT',
    });
  });

  it('respects bomb capacity', () => {
    const session = createRunningSession();

    expect(placeBomb(session, 'alice', 'bomb-1', 1000).success).toBe(true);

    // Situamos a Alice en otra casilla de suelo.
    session.players.get('alice')!.position = {
      x: 2.5,
      y: 3.5,
    };

    expect(placeBomb(session, 'alice', 'bomb-2', 1001)).toEqual({
      success: false,
      reason: 'BOMB_CAPACITY_REACHED',
    });
  });

  it('rejects placement before the game is running', () => {
    const session = createRunningSession();
    session.status = 'COUNTDOWN';

    expect(placeBomb(session, 'alice', 'bomb-1', 1000)).toEqual({
      success: false,
      reason: 'GAME_NOT_RUNNING',
    });
  });
});
