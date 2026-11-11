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

/**
 * ¿Dos tableros representan el mismo mapa? Compara dimensiones
 * y celda a celda.
 *
 * Los snapshots del servidor traen el tablero cada tick (20 Hz);
 * con esta comparación la escena solo se repinta cuando una
 * explosión cambia algo (p. ej. una caja pasa a piso).
 */
export function sameBoard(
  a: readonly (readonly number[])[],
  b: readonly (readonly number[])[]
): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let y = 0; y < a.length; y++) {
    const rowA = a[y];
    const rowB = b[y];

    if (rowA.length !== rowB.length) {
      return false;
    }

    for (let x = 0; x < rowA.length; x++) {
      if (rowA[x] !== rowB[x]) {
        return false;
      }
    }
  }

  return true;
}
