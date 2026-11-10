import type { TerrainType } from '@transcendence/shared';

import { TileType } from './types';

/**
 * Conversión del tablero autoritativo (`TerrainType`, string) a
 * los números que usan `GameScene` y `TileMap`.
 */
const TERRAIN_TO_TILE: Record<TerrainType, TileType> = {
  FLOOR: TileType.FLOOR,
  DESTRUCTIBLE: TileType.BLOCK,
  INDESTRUCTIBLE: TileType.WALL,
};

export function boardToTileMap(
  tiles: readonly (readonly TerrainType[])[]
): number[][] {
  return tiles.map((row) =>
    row.map((cell) => TERRAIN_TO_TILE[cell] ?? TileType.FLOOR)
  );
}
