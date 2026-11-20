import type { Position } from '@transcendence/shared';

import { TileType } from '../map/types';

const DIRECTIONS: readonly Position[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

/**
 * Celdas que cubre una explosión en la demo, con las mismas
 * reglas que el backend:
 * - la casilla de la bomba siempre se incluye;
 * - el brazo avanza por piso hasta el radio;
 * - una caja (destructible) se incluye y el brazo se detiene
 *   detrás (la destrucción la resuelve `DemoWorld`);
 * - un muro, una mesa o el borde cortan el brazo sin
 *   incluir la casilla.
 *
 * No encadena bombas (mejora posterior, ver GAME-F-13).
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

      // Indestructible o fuera del mapa: el rayo se corta
      // sin quemar esa casilla.
      if (tile !== TileType.FLOOR && tile !== TileType.BLOCK) {
        break;
      }

      cells.push({ x, y });

      // La caja se quema, pero no hay nada detrás.
      if (tile !== TileType.FLOOR) {
        break;
      }
    }
  }

  return cells;
}
