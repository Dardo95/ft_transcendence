import type { Position } from '@transcendence/shared';
import { describe, expect, it } from 'vitest';

import {
  classifyExplosionCells,
  type ExplosionCellKind,
} from './explosionCells';

function kindAt(
  cells: readonly Position[],
  x: number,
  y: number
): ExplosionCellKind | undefined {
  return classifyExplosionCells(cells).find(
    (cell) => cell.x === x && cell.y === y
  )?.kind;
}

const cross: Position[] = [
  { x: 5, y: 5 },
  { x: 4, y: 5 },
  { x: 6, y: 5 },
  { x: 5, y: 4 },
  { x: 5, y: 6 },
];

describe('classifyExplosionCells', () => {
  it('classifies a full cross', () => {
    expect(kindAt(cross, 5, 5)).toBe('center');
    expect(kindAt(cross, 4, 5)).toBe('horizontal');
    expect(kindAt(cross, 6, 5)).toBe('horizontal');
    expect(kindAt(cross, 5, 4)).toBe('vertical');
    expect(kindAt(cross, 5, 6)).toBe('vertical');
  });

  it('keeps the center when one arm is blocked', () => {
    const blockedTop = cross.filter((cell) => !(cell.x === 5 && cell.y === 4));

    expect(kindAt(blockedTop, 5, 5)).toBe('center');
    expect(kindAt(blockedTop, 5, 6)).toBe('vertical');
    expect(kindAt(blockedTop, 4, 5)).toBe('horizontal');
  });

  it('classifies a single cell as center', () => {
    expect(classifyExplosionCells([{ x: 2, y: 3 }])).toEqual([
      { x: 2, y: 3, kind: 'center' },
    ]);
  });

  it('promotes the middle of a horizontal line', () => {
    const line: Position[] = [
      { x: 7, y: 2 },
      { x: 6, y: 2 },
      { x: 5, y: 2 },
    ];

    expect(kindAt(line, 6, 2)).toBe('center');
    expect(kindAt(line, 5, 2)).toBe('horizontal');
    expect(kindAt(line, 7, 2)).toBe('horizontal');
  });

  it('promotes the middle of a vertical line regardless of order', () => {
    const line: Position[] = [
      { x: 9, y: 4 },
      { x: 9, y: 5 },
      { x: 9, y: 6 },
    ];

    expect(kindAt(line, 9, 5)).toBe('center');
    expect(kindAt(line, 9, 4)).toBe('vertical');
    expect(kindAt(line, 9, 6)).toBe('vertical');
  });

  it('classifies long arms with their tip as the arm axis', () => {
    const longCross: Position[] = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
      { x: 11, y: 10 },
      { x: 10, y: 9 },
    ];

    expect(kindAt(longCross, 10, 10)).toBe('center');
    expect(kindAt(longCross, 8, 10)).toBe('horizontal');
    expect(kindAt(longCross, 10, 9)).toBe('vertical');
  });
});
