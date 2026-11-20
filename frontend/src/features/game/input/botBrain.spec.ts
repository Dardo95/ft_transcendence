import { describe, expect, it } from 'vitest';

import { TileType } from '../map/types';
import {
  initialBotBrainState,
  isMoving,
  nextBotDecision,
  STOPPED_MOVEMENT,
  type BotBrainState,
} from './botBrain';

/** Sala de5x5 con borde de muros y suelo en el interior. */
function openRoom(): number[][] {
  const wall = TileType.WALL;
  const floor = TileType.FLOOR;
  return [
    [wall, wall, wall, wall, wall],
    [wall, floor, floor, floor, wall],
    [wall, floor, floor, floor, wall],
    [wall, floor, floor, floor, wall],
    [wall, wall, wall, wall, wall],
  ];
}

/** RNG determinista: repite la secuencia dada. */
function seqRng(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}

function stateWith(overrides: Partial<BotBrainState> = {}): BotBrainState {
  return { ...initialBotBrainState(), ...overrides };
}

const INPUTS = {
  nowMs: 1_000,
  map: openRoom(),
  position: { x: 2.5, y: 2.5 },
  alive: true,
  blocked: false,
  rng: seqRng([0, 0.5]),
};

describe('initialBotBrainState', () => {
  it('starts without direction and without bomb cooldown', () => {
    expect(initialBotBrainState()).toEqual({
      direction: STOPPED_MOVEMENT,
      directionUntilMs: 0,
      nextBombAtMs: 0,
    });
  });
});

describe('isMoving', () => {
  it('is false for stopped and true for any direction', () => {
    expect(isMoving(STOPPED_MOVEMENT)).toBe(false);
    expect(isMoving({ up: true, down: false, left: false, right: false })).toBe(
      true
    );
  });
});

describe('nextBotDecision', () => {
  it('picks a direction when the timer has elapsed', () => {
    const result = nextBotDecision(initialBotBrainState(), {
      ...INPUTS,
      nowMs: 0,
    });

    expect(isMoving(result.decision.movement)).toBe(true);
    expect(result.state.direction).toBe(result.decision.movement);
  });

  it('keeps the direction while the timer is active', () => {
    const previous = stateWith({
      direction: { up: false, down: false, left: false, right: true },
      directionUntilMs: 5_000,
    });

    const result = nextBotDecision(previous, {
      ...INPUTS,
      nowMs: 1_000,
      rng: seqRng([0]),
    });

    expect(result.decision.movement).toBe(previous.direction);
    expect(result.state.directionUntilMs).toBe(previous.directionUntilMs);
  });

  it('picks another direction when blocked by a wall', () => {
    const previous = stateWith({
      direction: { up: false, down: false, left: false, right: true },
      directionUntilMs: 5_000,
    });

    const result = nextBotDecision(previous, {
      ...INPUTS,
      blocked: true,
      rng: seqRng([0]),
    });

    expect(result.decision.movement).not.toBe(previous.direction);
    expect(isMoving(result.decision.movement)).toBe(true);
  });

  it('stops and does not bomb when dead', () => {
    const previous = stateWith({
      directionUntilMs: 0,
      nextBombAtMs: 0,
    });

    const result = nextBotDecision(previous, { ...INPUTS, alive: false });

    expect(result.decision.movement).toEqual(STOPPED_MOVEMENT);
    expect(result.decision.placeBomb).toBe(false);
    expect(result.state).toBe(previous);
  });

  it('places a bomb next to a wall once the cooldown is over', () => {
    // Tile (1,1): su vecino izquierdo es muro.
    const result = nextBotDecision(initialBotBrainState(), {
      ...INPUTS,
      nowMs: 0,
      position: { x: 1.5, y: 1.5 },
    });

    expect(result.decision.placeBomb).toBe(true);
    expect(result.state.nextBombAtMs).toBe(4_000);
  });

  it('does not bomb in the middle of the open floor', () => {
    // Tile (2,2): los4 vecinos son suelo.
    const result = nextBotDecision(initialBotBrainState(), {
      ...INPUTS,
      nowMs: 0,
      position: { x: 2.5, y: 2.5 },
    });

    expect(result.decision.placeBomb).toBe(false);
    expect(result.state.nextBombAtMs).toBe(0);
  });

  it('respects the bomb cooldown', () => {
    const previous = stateWith({ nextBombAtMs: 4_000 });

    const result = nextBotDecision(previous, {
      ...INPUTS,
      nowMs: 1_000,
      position: { x: 1.5, y: 1.5 },
    });

    expect(result.decision.placeBomb).toBe(false);
    expect(result.state.nextBombAtMs).toBe(4_000);
  });

  it('never mutates the previous state', () => {
    const previous = stateWith({ directionUntilMs: 0 });
    const copy = { ...previous, direction: { ...previous.direction } };

    nextBotDecision(previous, { ...INPUTS, blocked: true });

    expect(previous).toEqual(copy);
  });
});
