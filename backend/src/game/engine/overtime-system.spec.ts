import { describe, expect, it } from 'vitest';

import { GAME_DEFAULTS } from '../config/game-defaults.js';
import { parseMapText } from '../maps/map-loader.js';
import { placeBomb } from './bomb-system.js';
import { GameEngine } from './game-engine.js';
import { createGameSession } from './game-session.factory.js';
import { createOvertimeSpiral, updateOvertime } from './overtime-system.js';
import {
  setPlayerMovementInput,
  updatePlayerMovement,
} from './movement-system.js';

const MAP_TEXT = ['#######', '#1...2#', '#.....#', '#3...4#', '#######'].join(
  '\n'
);

function createRunningSession() {
  const session = createGameSession({
    id: 'a',
    mode: 'PRIVATE',
    map: parseMapText('overtime-map', MAP_TEXT),
    players: [
      { id: 'alice', displayName: 'Alice' },
      { id: 'bob', displayName: 'Bob' },
    ],
    nowMs: 1_000,
  });

  session.status = 'RUNNING';
  session.startedAtMs = 4_000;

  return session;
}

const overtimeAt = (startedAtMs = 4_000) =>
  startedAtMs + GAME_DEFAULTS.matchDurationMs;

const firstWallAt = (startedAtMs = 4_000) =>
  overtimeAt(startedAtMs) + GAME_DEFAULTS.overtimeFirstWallDelayMs;

describe('createOvertimeSpiral', () => {
  it('starts at the top-left inner cell and moves clockwise towards the centre', () => {
    expect(createOvertimeSpiral(5, 5)).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ]);
  });

  it('can rotate the starting corner without changing coverage', () => {
    expect(createOvertimeSpiral(5, 5, 'top-right')[0]).toEqual({
      x: 3,
      y: 1,
    });
    expect(createOvertimeSpiral(5, 5, 'bottom-right')[0]).toEqual({
      x: 3,
      y: 3,
    });
    expect(createOvertimeSpiral(5, 5, 'bottom-left')[0]).toEqual({
      x: 1,
      y: 3,
    });

    for (const corner of [
      'top-left',
      'top-right',
      'bottom-right',
      'bottom-left',
    ] as const) {
      const order = createOvertimeSpiral(13, 11, corner);

      expect(order).toHaveLength(99);
      expect(new Set(order.map(({ x, y }) => `${x},${y}`)).size).toBe(99);
    }
  });

  it('covers every inner cell exactly once on a rectangular board', () => {
    const order = createOvertimeSpiral(13, 11);
    const keys = order.map(({ x, y }) => `${x},${y}`);

    expect(order).toHaveLength(11 * 9);
    expect(new Set(keys).size).toBe(keys.length);
    expect(
      order.every(({ x, y }) => x >= 1 && x <= 11 && y >= 1 && y <= 9)
    ).toBe(true);
  });

  it('returns an empty order for invalid board dimensions', () => {
    expect(createOvertimeSpiral(2, 8)).toEqual([]);
    expect(createOvertimeSpiral(8, 2)).toEqual([]);
  });
});

describe('updateOvertime', () => {
  it('does not start before the configured match duration', () => {
    const session = createRunningSession();

    const result = updateOvertime(session, overtimeAt() - 1);

    expect(result).toEqual({
      started: false,
      closedTiles: [],
      killedPlayerIds: [],
    });
    expect(session.status).toBe('RUNNING');
    expect(session.overtime).toBeNull();
  });

  it('starts overtime exactly when the match duration expires without closing a wall immediately', () => {
    const session = createRunningSession();

    const result = updateOvertime(session, overtimeAt());

    expect(result.started).toBe(true);
    expect(result.closedTiles).toEqual([]);
    expect(session.status).toBe('OVERTIME');
    expect(session.overtime?.startedAtMs).toBe(overtimeAt());
    expect(session.overtime?.nextTileIndex).toBe(0);
  });

  it('closes the first inner perimeter tile after the warning delay', () => {
    const session = createRunningSession();

    updateOvertime(session, overtimeAt());

    const result = updateOvertime(session, firstWallAt());

    expect(result.closedTiles).toEqual([{ x: 1, y: 1 }]);
    expect(session.board.tiles[1][1]).toBe('INDESTRUCTIBLE');
    expect(session.overtime?.nextTileIndex).toBe(1);
  });

  it('closes subsequent tiles at the configured interval', () => {
    const session = createRunningSession();

    updateOvertime(session, overtimeAt());

    const beforeNext = updateOvertime(
      session,
      firstWallAt() + GAME_DEFAULTS.overtimeWallIntervalMs - 1
    );

    expect(beforeNext.closedTiles).toEqual([{ x: 1, y: 1 }]);

    const next = updateOvertime(
      session,
      firstWallAt() + GAME_DEFAULTS.overtimeWallIntervalMs
    );

    expect(next.closedTiles).toEqual([{ x: 2, y: 1 }]);
    expect(session.board.tiles[1][2]).toBe('INDESTRUCTIBLE');
  });

  it('catches up all tiles that became due while preserving spiral order', () => {
    const session = createRunningSession();

    updateOvertime(session, overtimeAt());

    const result = updateOvertime(
      session,
      firstWallAt() + GAME_DEFAULTS.overtimeWallIntervalMs * 2
    );

    expect(result.closedTiles).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ]);
  });

  it('kills a player caught by a closing wall and stops their movement', () => {
    const session = createRunningSession();
    const alice = session.players.get('alice')!;

    alice.movementInput.right = true;

    updateOvertime(session, overtimeAt());

    const result = updateOvertime(session, firstWallAt());

    expect(result.killedPlayerIds).toContain('alice');
    expect(alice.alive).toBe(false);
    expect(alice.movementInput).toEqual({
      up: false,
      down: false,
      left: false,
      right: false,
    });
  });

  it('removes bombs and power-ups trapped in a closing tile', () => {
    const session = createRunningSession();

    const placement = placeBomb(session, 'alice', 'bomb-alice', 5_000);

    expect(placement.success).toBe(true);
    if (!placement.success) return;

    const bomb = session.bombs.get('bomb-alice')!;

    bomb.position = { x: 1, y: 1 };
    session.players.get('alice')!.activeBombIds.add(bomb.id);

    session.powerUps.set('power-up-1', {
      id: 'power-up-1',
      type: 'SPEED',
      position: { x: 1, y: 1 },
    });

    updateOvertime(session, overtimeAt());
    updateOvertime(session, firstWallAt());

    expect(session.bombs.has('bomb-alice')).toBe(false);
    expect(session.players.get('alice')!.activeBombIds.has('bomb-alice')).toBe(
      false
    );
    expect(session.powerUps.has('power-up-1')).toBe(false);
  });

  it('does not schedule tiles that were already indestructible', () => {
    const session = createRunningSession();

    session.board.tiles[2][2] = 'INDESTRUCTIBLE';

    updateOvertime(session, overtimeAt());

    expect(session.overtime?.tileOrder).not.toContainEqual({
      x: 2,
      y: 2,
    });
  });

  it('rejects a non-finite timestamp', () => {
    const session = createRunningSession();

    expect(() => updateOvertime(session, Number.NaN)).toThrow(
      /nowMs must be finite/
    );
  });
});

describe('overtime integration', () => {
  it('starts overtime from the game engine when the regular duration expires', () => {
    const session = createRunningSession();
    const engine = new GameEngine();
    const overtimeAtMs = overtimeAt();

    session.players.get('alice')!.position = { x: 3.5, y: 2.5 };
    session.players.get('bob')!.position = { x: 4.5, y: 2.5 };

    const before = engine.tick(session, overtimeAtMs - 50, 0.05);

    expect(before.overtime?.started).toBe(false);
    expect(session.status).toBe('RUNNING');

    const atDeadline = engine.tick(session, overtimeAtMs, 0.05);

    expect(atDeadline.overtime?.started).toBe(true);
    expect(session.status).toBe('OVERTIME');
    expect(session.overtime?.nextTileIndex).toBe(0);
  });

  it('allows players to move and place bombs during overtime', () => {
    const session = createRunningSession();

    session.status = 'OVERTIME';
    session.players.get('alice')!.position = { x: 1.5, y: 2.5 };

    const movement = setPlayerMovementInput(session, 'alice', {
      up: false,
      down: false,
      left: false,
      right: true,
    });

    expect(movement).toEqual({ success: true });

    const beforeX = session.players.get('alice')!.position.x;

    updatePlayerMovement(session, 0.05);

    expect(session.players.get('alice')!.position.x).toBeGreaterThan(beforeX);

    const bomb = placeBomb(session, 'alice', 'overtime-bomb', 10_000);

    expect(bomb.success).toBe(true);
  });
});
