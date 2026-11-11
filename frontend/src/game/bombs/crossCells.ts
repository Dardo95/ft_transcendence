import type { Position } from '@transcendence/shared';

import { TileType } from '../map/types';

const DIRECTIONS: readonly Position[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

/**
 * Celdas que cubre una explosión en el demo: la casilla de la
 * bomba más los brazos en cruz, avanzando hasta el radio o hasta
 * el primer tile que no sea piso (muro, caja o mesa lo detiene).
 *
 * Simplificación del demo: el backend sí destruye cajas y corta
 * el brazo incluyéndolas; aquí no destruimos nada, así que el
 * brazo simplemente se detiene antes del obstáculo.
 */
export function crossCellsAt(
  map: number[][],
  origin: Position,
  radius: number
): Position[] {
  const cells: Position[] = [{ x: origin.x, y: origin.y }];

  for (const direction of DIRECTIONS) {
    for (let distance = 1; distance <= radius; distance++) {
      const x = origin.x + direction.x * distance;
      const y = origin.y + direction.y * distance;
      const tile = map[y]?.[x];

      if (tile !== TileType.FLOOR) {
        break;
      }

      cells.push({ x, y });
    }
  }

  return cells;
}
