import type { Position } from '@transcendence/shared';

export type ExplosionCellKind = 'center' | 'horizontal' | 'vertical';

export interface ClassifiedExplosionCell extends Position {
  kind: ExplosionCellKind;
}

function tileKey(x: number, y: number): string {
  return `${x},${y}`;
}

/**
 * Clasifica cada celda de una explosión para elegir su textura.
 *
 * `ExplosionSnapshot` solo trae las posiciones (la forma en cruz),
 * sin indicar dónde estaba la bomba ni la orientación, así que se
 * infiere de la geometría:
 * - vecinos en ambos ejes → centro
 * - solo vecinos horizontales → brazo horizontal
 * - solo vecinos verticales → brazo vertical
 * - sin centro aparente (línea recta, muros a los lados) → se
 *   promueve la celda con más vecinos
 */

export function classifyExplosionCells(
  cells: readonly Position[]
): ClassifiedExplosionCell[] {
  const present = new Set(cells.map((cell) => tileKey(cell.x, cell.y)));

  const neighbors = cells.map((cell) => {
    const horizontal =
      (present.has(tileKey(cell.x - 1, cell.y)) ? 1 : 0) +
      (present.has(tileKey(cell.x + 1, cell.y)) ? 1 : 0);
    const vertical =
      (present.has(tileKey(cell.x, cell.y - 1)) ? 1 : 0) +
      (present.has(tileKey(cell.x, cell.y + 1)) ? 1 : 0);

    return { horizontal, vertical };
  });

  const hasCenter = neighbors.some(
    (item) => item.horizontal > 0 && item.vertical > 0
  );

  let promotedIndex = -1;

  if (!hasCenter && cells.length > 0) {
    let best = -1;

    for (let index = 0; index < cells.length; index++) {
      const total = neighbors[index].horizontal + neighbors[index].vertical;

      if (total > best) {
        best = total;
        promotedIndex = index;
      }
    }
  }

  return cells.map((cell, index) => {
    const { horizontal, vertical } = neighbors[index];
    let kind: ExplosionCellKind;

    if (index === promotedIndex || (horizontal > 0 && vertical > 0)) {
      kind = 'center';
    } else if (vertical > 0) {
      kind = 'vertical';
    } else {
      kind = 'horizontal';
    }

    return { x: cell.x, y: cell.y, kind };
  });
}
