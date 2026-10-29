import type { Position, TerrainType } from '@transcendence/shared';

import type { LoadedMap } from '../maps/map-loader.js';
import type { GameBoard } from './game-state.js';

/**
 * Crea el tablero mutable de una partida a partir
 * de la definición cargada del mapa.
 *
 * Copia las filas y las posiciones iniciales para
 * que las partidas no compartan estado mutable.
 */
export function createGameBoard(map: LoadedMap): GameBoard {
  const spawnPoints: Record<number, Position> = {};

  for (const [id, position] of Object.entries(map.spawnPoints)) {
    spawnPoints[Number(id)] = { ...position };
  }

  return {
    id: map.id,
    width: map.width,
    height: map.height,
    tiles: map.tiles.map((row) => [...row]),
    spawnPoints,
  };
}

/**
 * Comprueba si las coordenadas corresponden
 * a una casilla existente del tablero.
 */
export function isInsideBoard(board: GameBoard, x: number, y: number): boolean {
  return (
    Number.isInteger(x) &&
    Number.isInteger(y) &&
    x >= 0 &&
    y >= 0 &&
    x < board.width &&
    y < board.height
  );
}

/**
 * Devuelve el terreno de una casilla.
 * null representa una coordenada fuera del tablero.
 */
export function getTerrainAt(
  board: GameBoard,
  x: number,
  y: number
): TerrainType | null {
  if (!isInsideBoard(board, x, y)) {
    return null;
  }

  return board.tiles[y][x];
}

/**
 * Una casilla solo es transitable por terreno
 * si contiene suelo. Las bombas se comprobarán
 * en un sistema de colisiones separado.
 */
export function isWalkableTile(
  board: GameBoard,
  x: number,
  y: number
): boolean {
  return getTerrainAt(board, x, y) === 'FLOOR';
}

/**
 * Destruye un muro destructible.
 * Devuelve true si se ha destruido.
 */
export function destroyDestructibleWallAt(
  board: GameBoard,
  x: number,
  y: number
): boolean {
  if (getTerrainAt(board, x, y) !== 'DESTRUCTIBLE') {
    return false;
  }

  board.tiles[y][x] = 'FLOOR';
  return true;
}
