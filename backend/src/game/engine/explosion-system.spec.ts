import { describe, expect, it } from 'vitest';

import { GAME_DEFAULTS } from '../config/game-defaults.js';
import { parseMapText } from '../maps/map-loader.js';
import { placeBomb } from './bomb-system.js';
import { createGameSession } from './game-session.factory.js';
import { updateBombsAndExplosions } from './explosion-system.js';
import { getTerrainAt } from './game-board.js';

const MAP_TEXT = [
  '#########',
  '#1.+...2#',
  '#.......#',
  '#.......#',
  '#3.....4#',
  '#########',
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

describe('updateBombsAndExplosions', () => {
  it('does not detonate a bomb before its timer expires', () => {
    const session = createRunningSession();

    placeBomb(session, 'alice', 'bomb-1', 1000);

    const result = updateBombsAndExplosions(
      session,
      1000 + GAME_DEFAULTS.bombFuseMs - 1
    );

    expect(result.detonatedBombIds).toEqual([]);
    expect(session.bombs.has('bomb-1')).toBe(true);
    expect(session.explosions.size).toBe(0);
  });

  it('detonates the bomb and destroys a destructible wall', () => {
    const session = createRunningSession();

    placeBomb(session, 'alice', 'bomb-1', 1000);

    const result = updateBombsAndExplosions(
      session,
      1000 + GAME_DEFAULTS.bombFuseMs
    );

    expect(result.detonatedBombIds).toEqual(['bomb-1']);

    expect(result.destroyedWalls).toContainEqual({
      x: 3,
      y: 1,
    });

    expect(getTerrainAt(session.board, 3, 1)).toBe('FLOOR');

    // El fuego no atraviesa el muro destruido
    // durante la misma resolución de la explosión.
    const explosion = [...session.explosions.values()][0];

    expect(explosion.cells).toContainEqual({ x: 3, y: 1 });
    expect(explosion.cells).not.toContainEqual({ x: 4, y: 1 });

    expect(session.bombs.size).toBe(0);
    expect(session.players.get('alice')!.activeBombIds.size).toBe(0);

    expect(result.killedPlayerIds).toContain('alice');
    expect(session.players.get('alice')!.alive).toBe(false);
  });

  it('triggers another bomb in a chain reaction', () => {
    const session = createRunningSession();

    // Bob coloca una bomba en la casilla contigua a Alice.
    session.players.get('bob')!.position = {
      x: 2.5,
      y: 1.5,
    };

    placeBomb(session, 'bob', 'bomb-bob', 1001);
    placeBomb(session, 'alice', 'bomb-alice', 1000);

    // La bomba de Bob aún no habría agotado su tiempo,
    // pero la explosión de Alice la alcanza.
    const result = updateBombsAndExplosions(
      session,
      1000 + GAME_DEFAULTS.bombFuseMs
    );

    expect(result.detonatedBombIds).toContain('bomb-alice');
    expect(result.detonatedBombIds).toContain('bomb-bob');

    expect(session.bombs.size).toBe(0);

    expect(session.players.get('alice')!.activeBombIds.size).toBe(0);

    expect(session.players.get('bob')!.activeBombIds.size).toBe(0);
  });

  it('keeps flames active and kills a player who enters them', () => {
    const session = createRunningSession();

    placeBomb(session, 'alice', 'bomb-1', 1000);

    updateBombsAndExplosions(session, 1000 + GAME_DEFAULTS.bombFuseMs);

    expect(session.explosions.size).toBeGreaterThan(0);

    // Bob entra en una casilla que sigue en llamas.
    session.players.get('bob')!.position = {
      x: 2.5,
      y: 1.5,
    };

    const result = updateBombsAndExplosions(
      session,
      1000 + GAME_DEFAULTS.bombFuseMs + 100
    );

    expect(result.killedPlayerIds).toContain('bob');
    expect(session.players.get('bob')!.alive).toBe(false);
  });

  it('removes expired flames', () => {
    const session = createRunningSession();

    placeBomb(session, 'alice', 'bomb-1', 1000);

    const detonationTime = 1000 + GAME_DEFAULTS.bombFuseMs;

    updateBombsAndExplosions(session, detonationTime);

    // Posición que habría sido alcanzada por la explosión.
    session.players.get('bob')!.position = {
      x: 2.5,
      y: 1.5,
    };

    const result = updateBombsAndExplosions(
      session,
      detonationTime + GAME_DEFAULTS.explosionDurationMs
    );

    expect(session.explosions.size).toBe(0);
    expect(result.killedPlayerIds).not.toContain('bob');
    expect(session.players.get('bob')!.alive).toBe(true);
  });
});
