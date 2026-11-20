import type {
  ExplosionSnapshot,
  GamePlayerSnapshot,
} from '@transcendence/shared';
import { describe, expect, it } from 'vitest';

import { TileType } from '../map/types';
import { DemoWorld } from './demoWorld';

/** Sala de 5x5 con una caja en el centro-alto (2,2). */
function roomMap(): number[][] {
  const wall = TileType.WALL;
  const floor = TileType.FLOOR;
  const block = TileType.BLOCK;
  return [
    [wall, wall, wall, wall, wall],
    [wall, floor, floor, floor, wall],
    [wall, floor, block, floor, wall],
    [wall, floor, floor, floor, wall],
    [wall, wall, wall, wall, wall],
  ];
}

/** RNG determinista: repite la secuencia dada. */
function seqRng(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}

function playerAt(
  overrides: Partial<GamePlayerSnapshot> = {}
): GamePlayerSnapshot {
  return {
    id: 'bren',
    isBot: false,
    position: { x: 2.5, y: 2.5 },
    alive: true,
    bombCapacity: 1,
    blastRadius: 2,
    speed: 4,
    ...overrides,
  };
}

// Bomba en (2,1): el brazo hacia abajo alcanza la caja (2,2).
const BOMB = { position: { x: 2, y: 1 }, blastRadius: 2 };

describe('DemoWorld', () => {
  it('keeps a private copy of the source map', () => {
    const source = roomMap();
    const world = new DemoWorld(source);

    world.map[2][2] = TileType.FLOOR;

    expect(world.map).not.toBe(source);
    expect(source[2][2]).toBe(TileType.BLOCK);
  });

  it('burns a crate reached by the blast', () => {
    const world = new DemoWorld(roomMap(), { random: () => 0.99 });

    const cells = world.detonate(BOMB);

    expect(cells).toContainEqual({ x: 2, y: 2 });
    expect(world.map[2][2]).toBe(TileType.FLOOR);
    expect(world.consumeMapChanged()).toBe(true);
    expect(world.consumeMapChanged()).toBe(false);
  });

  it('stops the arm behind the burned crate', () => {
    const world = new DemoWorld(roomMap(), { random: () => 0.99 });

    const cells = world.detonate(BOMB);

    expect(cells).not.toContainEqual({ x: 2, y: 3 });
    expect(world.map[3][2]).toBe(TileType.FLOOR);
  });

  it('drops a power-up when the roll succeeds', () => {
    const world = new DemoWorld(roomMap(), { random: () => 0 });

    world.detonate(BOMB);

    expect(world.getPowerUps()).toHaveLength(1);
    expect(world.getPowerUps()[0]).toMatchObject({
      type: 'EXTRA_BOMB',
      position: { x: 2, y: 2 },
    });
    expect(world.consumePowerUpsChanged()).toBe(true);
    expect(world.consumePowerUpsChanged()).toBe(false);
  });

  it('does not drop when the roll fails', () => {
    const world = new DemoWorld(roomMap(), { random: () => 0.99 });

    world.detonate(BOMB);

    expect(world.getPowerUps()).toHaveLength(0);
    expect(world.consumePowerUpsChanged()).toBe(false);
  });

  it('picks the power-up type from the second roll', () => {
    // Drop: 0 (< 0.25). Tipo: 0.9 * 3 → índice 2 (SPEED).
    const world = new DemoWorld(roomMap(), { random: seqRng([0, 0.9]) });

    world.detonate(BOMB);

    expect(world.getPowerUps()[0]?.type).toBe('SPEED');
  });

  it('applies the power-up to the collector and removes it', () => {
    const world = new DemoWorld(roomMap(), { random: () => 0 });
    world.detonate(BOMB);
    world.consumePowerUpsChanged(); // descartar el aviso del drop
    const bren = playerAt();

    world.collect([bren], [], 1_000);

    expect(bren.bombCapacity).toBe(2);
    expect(world.getPowerUps()).toHaveLength(0);
    expect(world.consumePowerUpsChanged()).toBe(true);
  });

  it('caps the stat at the backend maximum', () => {
    const world = new DemoWorld(roomMap(), { random: () => 0 });
    world.detonate(BOMB);
    const bren = playerAt({ bombCapacity: 5 });

    world.collect([bren], [], 1_000);

    expect(bren.bombCapacity).toBe(5);
  });

  it('increments speed by 0.5', () => {
    const world = new DemoWorld(roomMap(), { random: seqRng([0, 0.9]) });
    world.detonate(BOMB);
    const bren = playerAt();

    world.collect([bren], [], 1_000);

    expect(bren.speed).toBe(4.5);
  });

  it('ignores dead players', () => {
    const world = new DemoWorld(roomMap(), { random: () => 0 });
    world.detonate(BOMB);
    world.consumePowerUpsChanged(); // descartar el aviso del drop
    const bren = playerAt({ alive: false });

    world.collect([bren], [], 1_000);

    expect(world.getPowerUps()).toHaveLength(1);
    expect(world.consumePowerUpsChanged()).toBe(false);
  });

  it('does not collect inside an active flame, but does after it fades', () => {
    const world = new DemoWorld(roomMap(), { random: () => 0 });
    world.detonate(BOMB);
    const bren = playerAt();
    const flame: ExplosionSnapshot = {
      id: 'flame',
      cells: [{ x: 2, y: 2 }],
      expiresAt: 2_000,
    };

    world.collect([bren], [flame], 1_000);
    expect(world.getPowerUps()).toHaveLength(1);

    world.collect([bren], [flame], 2_500);
    expect(world.getPowerUps()).toHaveLength(0);
    expect(bren.bombCapacity).toBe(2);
  });

  describe('bomb solidity', () => {
    // Bomba en (2,1), una casilla de piso de la sala.
    const PLACED = { id: 'bomb-1', position: { x: 2, y: 1 } };

    it('blocks players who were not on the bomb when it was placed', () => {
      const world = new DemoWorld(roomMap());
      const bren = playerAt({ position: { x: 1.5, y: 1.5 } });

      world.registerBomb(PLACED, [bren]);

      // Lejos no bloquea...
      expect(world.blocksPlayer('bren', 1.5, 1.5)).toBe(false);
      // ...pero acercarse a la casilla sí.
      expect(world.blocksPlayer('bren', 1.9, 1.5)).toBe(true);
    });

    it('lets the placer walk out but never back in', () => {
      const world = new DemoWorld(roomMap());
      const bren = playerAt({ position: { x: 2.5, y: 1.5 } });

      world.registerBomb(PLACED, [bren]);

      // Pisándola: el pase deja salir...
      expect(world.blocksPlayer('bren', 2.5, 1.5)).toBe(false);
      world.releasePassThrough('bren', { x: 2.5, y: 1.5 });
      expect(world.blocksPlayer('bren', 2.5, 1.5)).toBe(false);

      // ...y en cuanto sale, se suelta el pase.
      world.releasePassThrough('bren', { x: 3.5, y: 1.5 });
      expect(world.blocksPlayer('bren', 2.5, 1.5)).toBe(true);
    });

    it('stops blocking once the bomb detonates', () => {
      const world = new DemoWorld(roomMap());
      const bren = playerAt({ position: { x: 1.5, y: 1.5 } });

      world.registerBomb(PLACED, [bren]);
      expect(world.blocksPlayer('bren', 1.9, 1.5)).toBe(true);

      world.forgetBomb(PLACED.id);

      expect(world.blocksPlayer('bren', 1.9, 1.5)).toBe(false);
    });

    it('does not give the pass to dead players', () => {
      const world = new DemoWorld(roomMap());
      const dead = playerAt({
        position: { x: 2.5, y: 1.5 },
        alive: false,
      });

      world.registerBomb(PLACED, [dead]);

      expect(world.blocksPlayer(dead.id, 2.5, 1.5)).toBe(true);
    });
  });
});
