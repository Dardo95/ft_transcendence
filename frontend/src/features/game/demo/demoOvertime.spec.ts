import type { GamePlayerSnapshot } from '@transcendence/shared';
import { describe, expect, it } from 'vitest';

import { TileType } from '../map/types';
import { DemoOvertime } from './demoOvertime';
import { DemoWorld } from './demoWorld';

/** Sala de 5x5 con una caja en el centro (2,2). */
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

// `map1` tiene esquina top-left (FNV-1a): el primer anillo de
// la espiral empieza en (1,1) y sigue por (2,1), (3,1)…
const MAP_ID = 'map1';
const DURATION_AT_MS = 180_000;
const FIRST_WALL_AT_MS = DURATION_AT_MS + 1_000;
const WALL_INTERVAL_MS = 250;

describe('DemoOvertime', () => {
  it('stays idle before the match duration', () => {
    const world = new DemoWorld(roomMap());
    const overtime = new DemoOvertime(world, MAP_ID);

    const killed = overtime.update(DURATION_AT_MS - 1, [playerAt()]);

    expect(overtime.isOvertime).toBe(false);
    expect(killed).toEqual([]);
    expect(world.consumeMapChanged()).toBe(false);
  });

  it('starts at the duration but closes nothing before the warning delay', () => {
    const world = new DemoWorld(roomMap());
    const overtime = new DemoOvertime(world, MAP_ID);

    overtime.update(DURATION_AT_MS, [playerAt()]);

    expect(overtime.isOvertime).toBe(true);
    expect(world.consumeMapChanged()).toBe(false);
  });

  it('closes one tile per interval in spiral order from the mapId corner', () => {
    const world = new DemoWorld(roomMap());
    const overtime = new DemoOvertime(world, MAP_ID);

    overtime.update(FIRST_WALL_AT_MS, []);
    expect(world.map[1][1]).toBe(TileType.WALL);
    expect(world.map[1][2]).toBe(TileType.FLOOR);

    overtime.update(FIRST_WALL_AT_MS + WALL_INTERVAL_MS, []);
    expect(world.map[1][2]).toBe(TileType.WALL);
    expect(world.map[1][3]).toBe(TileType.FLOOR);
  });

  it('kills a player standing on the closing tile', () => {
    const world = new DemoWorld(roomMap());
    const overtime = new DemoOvertime(world, MAP_ID);
    const player = playerAt({ position: { x: 1.5, y: 1.5 } });

    const killed = overtime.update(FIRST_WALL_AT_MS, [player]);

    expect(killed).toEqual(['bren']);
    expect(player.alive).toBe(false);
    expect(world.consumeMapChanged()).toBe(true);
  });

  it('keeps the border intact while closing every interior tile', () => {
    const world = new DemoWorld(roomMap());
    const overtime = new DemoOvertime(world, MAP_ID);

    // Mucho después del último due: todo el interior cerrado y
    // el borde (ya muro) intacto.
    overtime.update(DURATION_AT_MS + 10_000, []);

    for (let y = 0; y < world.map.length; y++) {
      for (let x = 0; x < world.map[y].length; x++) {
        expect(world.map[y][x]).toBe(TileType.WALL);
      }
    }
  });

  it('removes the power-up and the bomb on the closed tile', () => {
    const world = new DemoWorld(roomMap(), { random: () => 0 });
    // Caja (2,2) quemada con drop garantizado → power-up encima.
    world.detonate({ position: { x: 2, y: 1 }, blastRadius: 2 });
    world.registerBomb({ id: 'bomb-1', position: { x: 1, y: 1 } }, []);
    expect(world.blocksPlayer('bren', 1.5, 1.5)).toBe(true);

    world.closeWall(1, 1, []);
    world.closeWall(2, 2, []);

    expect(world.blocksPlayer('bren', 1.5, 1.5)).toBe(false);
    expect(world.getPowerUps()).toEqual([]);
    expect(world.consumePowerUpsChanged()).toBe(true);
  });
});
