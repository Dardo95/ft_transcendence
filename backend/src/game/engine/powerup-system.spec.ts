import { describe, expect, it } from 'vitest';

import { parseMapText } from '../maps/map-loader.js';
import { createGameSession } from './game-session.factory.js';
import {
  collectPowerUps,
  spawnPowerUpsFromDestroyedWalls,
} from './powerup-system.js';
import type { PowerUpType } from '@transcendence/shared';

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

describe('power-up generation', () => {
  it('spawns a power-up on a destroyed wall', () => {
    const session = createRunningSession();

    // El muro de prueba deja de existir.
    session.board.tiles[1][3] = 'FLOOR';

    const spawned = spawnPowerUpsFromDestroyedWalls(session, [{ x: 3, y: 1 }], {
      random: () => 0,
      createId: () => 'power-up-1',
    });

    expect(spawned).toHaveLength(1);
    expect(spawned[0]).toEqual({
      id: 'power-up-1',
      type: 'EXTRA_BOMB',
      position: { x: 3, y: 1 },
    });

    expect(session.powerUps.size).toBe(1);
  });

  it('does not spawn when the probability roll fails', () => {
    const session = createRunningSession();
    session.board.tiles[1][3] = 'FLOOR';

    const spawned = spawnPowerUpsFromDestroyedWalls(session, [{ x: 3, y: 1 }], {
      random: () => 0.99,
    });

    expect(spawned).toHaveLength(0);
    expect(session.powerUps.size).toBe(0);
  });
});

describe('power-up collection', () => {
  it.each([
    ['EXTRA_BOMB', 'bombCapacity', 2],
    ['BLAST_RADIUS', 'blastRadius', 3],
    ['SPEED', 'speedTilesPerSecond', 4.5],
  ] as const)('applies %s to the player', (type, stat, expected) => {
    const session = createRunningSession();

    // Alice aparece en el centro de la casilla (1, 1).
    // Colocamos la mejora en esa casilla.
    session.powerUps.set('power-up-1', {
      id: 'power-up-1',
      type: type as PowerUpType,
      position: { x: 1, y: 1 },
    });

    const collected = collectPowerUps(session);

    expect(collected).toContainEqual({
      powerUpId: 'power-up-1',
      playerId: 'alice',
      type,
    });

    expect(session.players.get('alice')![stat]).toBe(expected);

    expect(session.powerUps.has('power-up-1')).toBe(false);
  });

  it('does not collect the same power-up twice', () => {
    const session = createRunningSession();

    session.powerUps.set('power-up-1', {
      id: 'power-up-1',
      type: 'EXTRA_BOMB',
      position: { x: 1, y: 1 },
    });

    collectPowerUps(session);

    const secondCollection = collectPowerUps(session);

    expect(secondCollection).toEqual([]);
    expect(session.players.get('alice')!.bombCapacity).toBe(2);
  });

  it('does not exceed the configured stat limits', () => {
    const session = createRunningSession();
    const alice = session.players.get('alice')!;

    alice.bombCapacity = 5;

    session.powerUps.set('power-up-1', {
      id: 'power-up-1',
      type: 'EXTRA_BOMB',
      position: { x: 1, y: 1 },
    });

    collectPowerUps(session);

    expect(alice.bombCapacity).toBe(5);
  });

  it('does not collect a power-up inside an active explosion', () => {
    const session = createRunningSession();

    session.players.get('alice')!.position = {
      x: 2.5,
      y: 2.5,
    };

    session.powerUps.set('power-up-1', {
      id: 'power-up-1',
      type: 'SPEED',
      position: { x: 2, y: 2 },
    });

    session.explosions.set('explosion-1', {
      id: 'explosion-1',
      cells: [{ x: 2, y: 2 }],
      expiresAtMs: 5000,
    });

    const collected = collectPowerUps(session);

    expect(collected).toEqual([]);
    expect(session.powerUps.has('power-up-1')).toBe(true);
  });
});
