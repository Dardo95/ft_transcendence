import { describe, expect, it } from 'vitest';
import type { TerrainType } from '@transcendence/shared';

import { boardToTileMap, sameBoard } from './boardConversion';
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

describe('sameBoard', () => {
  it('accepts boards with the same tiles', () => {
    const a = [
      [TileType.WALL, TileType.FLOOR, TileType.BLOCK],
      [TileType.FLOOR, TileType.BLOCK, TileType.FLOOR],
    ];
    const b = [
      [TileType.WALL, TileType.FLOOR, TileType.BLOCK],
      [TileType.FLOOR, TileType.BLOCK, TileType.FLOOR],
    ];

    expect(sameBoard(a, b)).toBe(true);
  });

  it('rejects a board with a destroyed crate', () => {
    const before = [
      [TileType.WALL, TileType.BLOCK],
      [TileType.FLOOR, TileType.FLOOR],
    ];
    const after = [
      [TileType.WALL, TileType.FLOOR],
      [TileType.FLOOR, TileType.FLOOR],
    ];

    expect(sameBoard(before, after)).toBe(false);
  });

  it('rejects boards with different dimensions', () => {
    const twoRows = [
      [TileType.FLOOR, TileType.FLOOR],
      [TileType.FLOOR, TileType.FLOOR],
    ];
    const oneRow = [[TileType.FLOOR, TileType.FLOOR]];
    const shortRow = [[TileType.FLOOR]];

    expect(sameBoard(twoRows, oneRow)).toBe(false);
    expect(sameBoard(oneRow, twoRows)).toBe(false);
    expect(sameBoard(oneRow, shortRow)).toBe(false);
  });

  it('treats two empty boards as equal', () => {
    expect(sameBoard([], [])).toBe(true);
  });

  it('does not mutate its arguments', () => {
    const a = [[TileType.FLOOR, TileType.BLOCK]];
    const b = [[TileType.FLOOR, TileType.FLOOR]];

    sameBoard(a, b);

    expect(a).toEqual([[TileType.FLOOR, TileType.BLOCK]]);
    expect(b).toEqual([[TileType.FLOOR, TileType.FLOOR]]);
  });
});
