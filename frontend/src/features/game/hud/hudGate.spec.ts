import type { BombSnapshot, GamePlayerSnapshot } from '@transcendence/shared';
import { describe, expect, it } from 'vitest';

import { nextHudGate, type HudGateState } from './hudGate';

function player(
  overrides: Partial<GamePlayerSnapshot> = {}
): GamePlayerSnapshot {
  return {
    id: 'p1',
    displayName: 'P1',
    isBot: false,
    position: { x: 1, y: 1 },
    alive: true,
    bombCapacity: 1,
    blastRadius: 2,
    speed: 4,
    ...overrides,
  };
}

function bomb(overrides: Partial<BombSnapshot> = {}): BombSnapshot {
  return {
    id: 'b1',
    ownerId: 'p1',
    position: { x: 1, y: 1 },
    detonateAt: 1_000,
    blastRadius: 2,
    ...overrides,
  };
}

const BASE: HudGateState = {
  second: 0,
  ownBombs: 0,
  aliveCount: 1,
  localId: 'p1',
  localAlive: true,
  capacity: 1,
  blast: 2,
  speed: 4,
  isOvertime: false,
};

const INPUTS = {
  players: [player()],
  bombs: [],
  localId: 'p1',
  elapsedMs: 0,
  isOvertime: false,
};

describe('nextHudGate', () => {
  it('returns null when nothing visible changed', () => {
    expect(nextHudGate(BASE, INPUTS)).toBeNull();
  });

  it('changes when the clock second advances', () => {
    const next = nextHudGate(BASE, { ...INPUTS, elapsedMs: 1_000 });

    expect(next?.second).toBe(1);
  });

  it('changes when an own bomb is placed', () => {
    const next = nextHudGate(BASE, {
      ...INPUTS,
      bombs: [bomb()],
    });

    expect(next?.ownBombs).toBe(1);
  });

  it('counts only bombs owned by the local player', () => {
    const next = nextHudGate(BASE, {
      ...INPUTS,
      bombs: [bomb({ ownerId: 'other' })],
    });

    expect(next).toBeNull();
  });

  it('changes when a player dies', () => {
    const next = nextHudGate(BASE, {
      ...INPUTS,
      players: [player({ alive: false })],
    });

    expect(next?.aliveCount).toBe(0);
    expect(next?.localAlive).toBe(false);
  });

  it('changes when local stats change (power-up)', () => {
    const next = nextHudGate(BASE, {
      ...INPUTS,
      players: [player({ blastRadius: 3 })],
    });

    expect(next?.blast).toBe(3);
  });

  it('changes when the local id is not resolved yet', () => {
    const next = nextHudGate(BASE, {
      ...INPUTS,
      localId: '',
    });

    expect(next?.localId).toBe('');
    expect(next?.capacity).toBe(0);
  });

  it('returns a fresh state (never mutates prev)', () => {
    const next = nextHudGate(BASE, { ...INPUTS, elapsedMs: 2_000 });

    expect(next).not.toBe(BASE);
    expect(BASE.second).toBe(0);
  });

  it('changes when the match enters overtime', () => {
    const next = nextHudGate(BASE, {
      ...INPUTS,
      isOvertime: true,
    });

    expect(next?.isOvertime).toBe(true);
  });
});
