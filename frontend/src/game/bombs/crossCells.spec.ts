import { describe, expect, it } from 'vitest';

import { TileType } from '../map/types';
import { crossCellsAt } from './crossCells';

// 7x7 de piso con muros en el borde.
function openMap(size = 7): number[][] {
  return Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) =>
      x === 0 || y === 0 || x === size - 1 || y === size - 1
        ? TileType.WALL
        : TileType.FLOOR
    )
  );
}

describe('crossCellsAt', () => {
  it('always includes the bomb tile', () => {
    const cells = crossCellsAt(openMap(), { x: 3, y: 3 }, 2);

    expect(cells).toContainEqual({ x: 3, y: 3 });
  });

  it('spreads up to the radius in open floor', () => {
    const cells = crossCellsAt(openMap(), { x: 3, y: 3 }, 2);

    expect(cells).toHaveLength(9);
    expect(cells).toContainEqual({ x: 1, y: 3 });
    expect(cells).toContainEqual({ x: 5, y: 3 });
    expect(cells).toContainEqual({ x: 3, y: 1 });
    expect(cells).toContainEqual({ x: 3, y: 5 });
  });

  it('stops an arm at a wall without crossing it', () => {
    const map = openMap();
    map[3][4] = TileType.WALL;

    const cells = crossCellsAt(map, { x: 3, y: 3 }, 3);

    expect(cells).not.toContainEqual({ x: 4, y: 3 });
    expect(cells).not.toContainEqual({ x: 5, y: 3 });
    // Los demás brazos siguen completos.
    expect(cells).toContainEqual({ x: 1, y: 3 });
    expect(cells).toContainEqual({ x: 3, y: 5 });
  });

  it('does not leave the map bounds', () => {
    const cells = crossCellsAt(openMap(5), { x: 1, y: 1 }, 5);

    for (const cell of cells) {
      expect(cell.x).toBeGreaterThanOrEqual(0);
      expect(cell.x).toBeLessThan(5);
      expect(cell.y).toBeGreaterThanOrEqual(0);
      expect(cell.y).toBeLessThan(5);
    }
  });
});
