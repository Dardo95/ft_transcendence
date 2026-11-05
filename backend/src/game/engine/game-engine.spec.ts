import { describe, expect, it } from 'vitest';

import { GAME_DEFAULTS } from '../config/game-defaults.js';
import { parseMapText } from '../maps/map-loader.js';
import { placeBomb } from './bomb-system.js';
import { createGameSession } from './game-session.factory.js';
import { setPlayerMovementInput } from './movement-system.js';
import { GameEngine } from './game-engine.js';

const MAP_TEXT = [
  '#######',
  '#1.+.2#',
  '#.#.#.#',
  '#.....#',
  '#3...4#',
  '#######',
].join('\n');

function createSession() {
  const map = parseMapText('test-map', MAP_TEXT);

  return createGameSession({
    id: 'game-engine-test',
    mode: 'PRIVATE',
    map,
    players: [
      { id: 'alice', displayName: 'Alice' },
      { id: 'bob', displayName: 'Bob' },
    ],
    nowMs: 1000,
  });
}

describe('GameEngine', () => {
  it('starts the game when the countdown finishes', () => {
    const engine = new GameEngine();
    const session = createSession();

    const beforeStart = engine.tick(session, 3999, 0.05);

    expect(beforeStart.started).toBe(false);
    expect(session.status).toBe('COUNTDOWN');

    const start = engine.tick(session, 4000, 0.05);

    expect(start.started).toBe(true);
    expect(session.status).toBe('RUNNING');
    expect(session.startedAtMs).toBe(4000);
  });

  it('coordinates continuous movement', () => {
    const engine = new GameEngine();
    const session = createSession();

    engine.tick(session, 4000, 0.05);

    setPlayerMovementInput(session, 'alice', {
      up: false,
      down: false,
      left: false,
      right: true,
    });

    engine.tick(session, 4050, 0.05);

    const position = session.players.get('alice')!.position;

    expect(position.x).toBeCloseTo(1.7, 10);
    expect(position.y).toBeCloseTo(1.5, 10);
  });

  it('coordinates bomb detonation and victory', () => {
    const engine = new GameEngine();
    const session = createSession();

    engine.tick(session, 4000, 0.05);

    const placement = placeBomb(session, 'alice', 'bomb-alice', 4000);

    expect(placement.success).toBe(true);

    const result = engine.tick(session, 4000 + GAME_DEFAULTS.bombFuseMs, 0.05);

    expect(result.explosions?.detonatedBombIds).toContain('bomb-alice');

    expect(session.players.get('alice')!.alive).toBe(false);
    expect(session.players.get('bob')!.alive).toBe(true);

    expect(session.status).toBe('FINISHED');
    expect(session.winnerId).toBe('bob');

    expect(result.outcome?.newlyFinished).toBe(true);
  });

  it('does not update a finished game', () => {
    const engine = new GameEngine();
    const session = createSession();

    engine.tick(session, 4000, 0.05);

    session.status = 'FINISHED';
    session.winnerId = 'alice';

    const previousPosition = {
      ...session.players.get('alice')!.position,
    };

    const result = engine.tick(session, 4050, 0.05);

    expect(result.explosions).toBeNull();
    expect(result.outcome).toBeNull();

    expect(session.players.get('alice')!.position).toEqual(previousPosition);
  });
});
