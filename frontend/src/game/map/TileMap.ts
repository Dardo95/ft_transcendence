import { TileType } from './types';

export const TILE_SIZE = 64;

export const testMap: number[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 1, 2, 1, 4, 1, 2, 1, 4, 1, 2, 1, 2],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 1, 4, 1, 2, 3, 2, 1, 2, 1, 4, 1, 2],
  [2, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 2],
  [2, 1, 2, 1, 2, 1, 3, 1, 2, 1, 2, 1, 2],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
];

export function getTileTexture(tile: number): string | null {
  switch (tile) {
    case TileType.FLOOR:
      return 'tile_floor.png';
    case TileType.WALL:
      return 'tile_wall.png';
    case TileType.BLOCK:
      return 'crate_wood.png';
    case TileType.TABLE:
      return 'tile_table.png';
    case TileType.EMPTY:
    default:
      return null;
  }
}
