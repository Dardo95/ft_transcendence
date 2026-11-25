import type { Position, WorldPosition } from "./game.js";

/**
 * Lógica pura de la muerte súbita (overtime): espiral de cierre,
 * esquina de arranque estable por hash y hitbox de muerte. El
 * backend la consume desde sus módulos originales (re-export)
 * y la demo de frontend la usa para cerrar muros igual que el
 * servidor.
 */

export type OvertimeStartCorner = "top-left" | "top-right" | "bottom-right" | "bottom-left";

const OVERTIME_START_CORNERS: OvertimeStartCorner[] = [
  "top-left",
  "top-right",
  "bottom-right",
  "bottom-left",
];

function getRing(left: number, right: number, top: number, bottom: number): Position[] {
  const ring: Position[] = [];

  for (let x = left; x <= right; x++) {
    ring.push({ x, y: top });
  }

  for (let y = top + 1; y <= bottom; y++) {
    ring.push({ x: right, y });
  }

  if (top < bottom) {
    for (let x = right - 1; x >= left; x--) {
      ring.push({ x, y: bottom });
    }
  }

  if (left < right) {
    for (let y = bottom - 1; y > top; y--) {
      ring.push({ x: left, y });
    }
  }

  return ring;
}

/**
 * Returns the playable cells in a clockwise spiral, starting at the
 * requested inner corner and ending at the centre. The outer map border
 * is excluded because it is already indestructible.
 */
export function createOvertimeSpiral(
  width: number,
  height: number,
  startCorner: OvertimeStartCorner = "top-left",
): Position[] {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 3 || height < 3) {
    return [];
  }

  const positions: Position[] = [];
  let left = 1;
  let right = width - 2;
  let top = 1;
  let bottom = height - 2;

  while (left <= right && top <= bottom) {
    const ring = getRing(left, right, top, bottom);
    const startPosition: Position = {
      x: startCorner.endsWith("right") ? right : left,
      y: startCorner.startsWith("bottom") ? bottom : top,
    };
    const startIndex = ring.findIndex(
      (position) => position.x === startPosition.x && position.y === startPosition.y,
    );

    const offset = Math.max(0, startIndex);
    for (let index = 0; index < ring.length; index++) {
      positions.push(ring[(offset + index) % ring.length]);
    }

    left++;
    right--;
    top++;
    bottom--;
  }

  return positions;
}

/**
 * FNV-1a: orientación estable por partida, sin depender de
 * Math.random. El backend lo aplica al sessionId de la partida
 * y la demo al mapId.
 */
export function pickOvertimeCorner(seed: string): OvertimeStartCorner {
  let hash = 0x811c9dc5;

  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return OVERTIME_START_CORNERS[(hash >>> 0) % OVERTIME_START_CORNERS.length];
}

export const PLAYER_HALF_SIZE = 0.3;

const EPSILON = 1e-9;

/**
 * Las casillas ocupan:
 * [tile.x, tile.x + 1] × [tile.y, tile.y + 1]
 *
 * Los jugadores tienen una hitbox cuadrada centrada
 * en su posición continua.
 */
export function overlapsTile(position: WorldPosition, tile: Position): boolean {
  const left = position.x - PLAYER_HALF_SIZE + EPSILON;
  const right = position.x + PLAYER_HALF_SIZE - EPSILON;
  const top = position.y - PLAYER_HALF_SIZE + EPSILON;
  const bottom = position.y + PLAYER_HALF_SIZE - EPSILON;

  return right > tile.x && left < tile.x + 1 && bottom > tile.y && top < tile.y + 1;
}
