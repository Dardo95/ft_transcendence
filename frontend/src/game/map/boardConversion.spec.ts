import { describe, expect, it } from 'vitest';
import type { TerrainType } from '@transcendence/shared';

import { boardToTileMap } from './boardConversion';
import { TileType } from './types';

describe('boardToTileMap', () => {
  it('maps every terrain to its tile number', () => {
    const tiles: TerrainType[][] = [
      ['INDESTRUCTIBLE', 'FLOOR', 'DESTRUCTIBLE'],
      ['FLOOR', 'INDESTRUCTIBLE', 'FLOOR'],
    ];

    expect(boardToTileMap(tiles)).toEqual([
      [TileType.WALL, TileType.FLOOR, TileType.BLOCK],
      [TileType.FLOOR, TileType.WALL, TileType.FLOOR],
    ]);
  });

  it('keeps the board dimensions', () => {
    const tiles: TerrainType[][] = [
      ['FLOOR', 'FLOOR', 'FLOOR', 'FLOOR'],
      ['FLOOR', 'FLOOR', 'FLOOR', 'FLOOR'],
      ['FLOOR', 'FLOOR', 'FLOOR', 'FLOOR'],
    ];

    const map = boardToTileMap(tiles);

    expect(map).toHaveLength(3);
    expect(map.every((row) => row.length === 4)).toBe(true);
  });

  it('handles an empty board', () => {
    expect(boardToTileMap([])).toEqual([]);
  });
});
