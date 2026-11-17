import type { GameSnapshot } from '@transcendence/shared';
import { describe, expect, it } from 'vitest';

import { deriveEndScreen } from './endScreen';

function snapshot(overrides: Partial<GameSnapshot> = {}): GameSnapshot {
  return {
    gameId: 'g1',
    mode: 'PRACTICE',
    status: 'RUNNING',
    elapsedMs: 0,
    board: { width: 2, height: 2, tiles: [] },
    players: [
      {
        id: 'local',
        isBot: false,
        position: { x: 0, y: 0 },
        alive: true,
        bombCapacity: 1,
        blastRadius: 1,
        speed: 4,
      },
      {
        id: 'rival',
        isBot: true,
        position: { x: 1, y: 1 },
        alive: true,
        bombCapacity: 1,
        blastRadius: 1,
        speed: 4,
      },
    ],
    bombs: [],
    explosions: [],
    powerUps: [],
    winnerId: null,
    ...overrides,
  };
}

function playerAlive(id: string, alive: boolean) {
  return {
    id,
    isBot: false,
    position: { x: 0, y: 0 },
    alive,
    bombCapacity: 1,
    blastRadius: 1,
    speed: 4,
  };
}

describe('deriveEndScreen', () => {
  it('keeps playing while the local player is alive', () => {
    expect(deriveEndScreen(snapshot(), 'local')).toBe('playing');
  });

  it('shows the dead screen when the local player dies mid-match', () => {
    const state = snapshot({
      players: [playerAlive('local', false), playerAlive('rival', true)],
    });

    expect(deriveEndScreen(state, 'local')).toBe('dead');
  });

  it('does not show the dead screen during COUNTDOWN', () => {
    // No debería pasar (nadie muere antes de empezar), pero el
    // estado `dead` no debe colarse en fases previas al juego.
    const state = snapshot({
      status: 'COUNTDOWN',
      players: [playerAlive('local', false)],
    });

    expect(deriveEndScreen(state, 'local')).toBe('playing');
  });

  it('shows victory when the local player won', () => {
    const state = snapshot({ status: 'FINISHED', winnerId: 'local' });

    expect(deriveEndScreen(state, 'local')).toBe('victory');
  });

  it('shows defeat when another player won', () => {
    const state = snapshot({ status: 'FINISHED', winnerId: 'rival' });

    expect(deriveEndScreen(state, 'local')).toBe('defeat');
  });

  it('shows defeat when the match finished without a winner', () => {
    const state = snapshot({ status: 'FINISHED', winnerId: null });

    expect(deriveEndScreen(state, 'local')).toBe('defeat');
  });

  it('never claims victory without a local identity', () => {
    const state = snapshot({ status: 'FINISHED', winnerId: null });

    expect(deriveEndScreen(state, null)).toBe('defeat');
  });

  it('ignores the death screen when there is no local identity', () => {
    const state = snapshot({
      players: [playerAlive('local', false), playerAlive('rival', true)],
    });

    expect(deriveEndScreen(state, null)).toBe('playing');
  });

  it('keeps playing when the local player is missing from the snapshot', () => {
    const state = snapshot({ players: [playerAlive('rival', true)] });

    expect(deriveEndScreen(state, 'local')).toBe('playing');
  });
});
