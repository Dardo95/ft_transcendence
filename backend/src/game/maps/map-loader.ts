import type { Position, TerrainType } from '@transcendence/shared';

export interface LoadedMap {
  id: string;
  width: number;
  height: number;
  tiles: TerrainType[][];
  spawnPoints: Record<number, Position>;
}

const MAP_SYMBOLS: Record<string, TerrainType> = {
  '.': 'FLOOR',
  '#': 'INDESTRUCTIBLE',
  '+': 'DESTRUCTIBLE',
};

export function parseMapText(mapId: string, rawText: string): LoadedMap {
  const lines = rawText
    .replace(/^\uFEFF/, '')
    .replace(/\r/g, '')
    .split('\n');

  // Permitir saltos de línea al final del archivo.
  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  if (lines.length < 3) {
    throw new Error(`Map ${mapId}: too few rows`);
  }

  const width = lines[0].length;
  const height = lines.length;

  if (width < 3) {
    throw new Error(`Map ${mapId}: too few columns`);
  }

  const spawnPoints: Record<number, Position> = {};
  const tiles: TerrainType[][] = [];

  for (let y = 0; y < height; y++) {
    const line = lines[y];

    if (line.length !== width) {
      throw new Error(`Map ${mapId}: row ${y + 1} has an invalid width`);
    }

    const tileRow: TerrainType[] = [];

    for (let x = 0; x < width; x++) {
      const symbol = line[x];

      if ('1234'.includes(symbol)) {
        const spawnId = Number(symbol);

        if (spawnPoints[spawnId]) {
          throw new Error(`Map ${mapId}: duplicate spawn ${spawnId}`);
        }

        spawnPoints[spawnId] = { x, y };
        tileRow.push('FLOOR');
        continue;
      }

      const terrain = MAP_SYMBOLS[symbol];

      if (!terrain) {
        throw new Error(
          `Map ${mapId}: invalid symbol "${symbol}" at (${x}, ${y})`
        );
      }

      tileRow.push(terrain);
    }

    tiles.push(tileRow);
  }

  for (let spawnId = 1; spawnId <= 4; spawnId++) {
    if (!spawnPoints[spawnId]) {
      throw new Error(`Map ${mapId}: missing spawn ${spawnId}`);
    }
  }

  return {
    id: mapId,
    width,
    height,
    tiles,
    spawnPoints,
  };
}
