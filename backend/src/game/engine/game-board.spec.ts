import { describe, expect, it } from 'vitest';

import { parseMapText } from '../maps/map-loader.js';

import {
  createGameBoard,
  destroyDestructibleWallAt,
  getTerrainAt,
  isInsideBoard,
  isWalkableTile,
} from './game-board.js';

const MAP_TEXT = ['#######', '#1.+.2#', '#.....#', '#3...4#', '#######'].join(
  '\n'
);

describe('GameBoard', () => {
  it('creates a board with the correct dimensions', () => {
    const map = parseMapText('test-map', MAP_TEXT);
    const board = createGameBoard(map);

    expect(board.width).toBe(7);
    expect(board.height).toBe(5);

    expect(board.spawnPoints[1]).toEqual({ x: 1, y: 1 });
    expect(board.spawnPoints[4]).toEqual({ x: 5, y: 3 });
  });

  it('recognizes the terrain of a tile', () => {
    const map = parseMapText('test-map', MAP_TEXT);
    const board = createGameBoard(map);

    expect(getTerrainAt(board, 3, 1)).toBe('DESTRUCTIBLE');
    expect(getTerrainAt(board, 2, 1)).toBe('FLOOR');
    expect(getTerrainAt(board, 0, 0)).toBe('INDESTRUCTIBLE');
  });

  it('does not allow coordinates outside the board', () => {
    const map = parseMapText('test-map', MAP_TEXT);
    const board = createGameBoard(map);

    expect(isInsideBoard(board, -1, 0)).toBe(false);
    expect(isInsideBoard(board, 7, 0)).toBe(false);
    expect(getTerrainAt(board, -1, 0)).toBeNull();
    expect(isWalkableTile(board, 0, 0)).toBe(false);
  });

  it('destroys a destructible wall without changing the map template', () => {
    const map = parseMapText('test-map', MAP_TEXT);

    const boardA = createGameBoard(map);
    const boardB = createGameBoard(map);

    expect(destroyDestructibleWallAt(boardA, 3, 1)).toBe(true);

    expect(getTerrainAt(boardA, 3, 1)).toBe('FLOOR');

    // El tablero de otra partida permanece intacto.
    expect(getTerrainAt(boardB, 3, 1)).toBe('DESTRUCTIBLE');

    // La plantilla cargada tampoco se modifica.
    expect(map.tiles[1][3]).toBe('DESTRUCTIBLE');
  });

  it('does not destroy indestructible walls or floor', () => {
    const map = parseMapText('test-map', MAP_TEXT);
    const board = createGameBoard(map);

    expect(destroyDestructibleWallAt(board, 0, 0)).toBe(false);
    expect(destroyDestructibleWallAt(board, 2, 1)).toBe(false);
  });
});
