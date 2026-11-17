import { describe, expect, it } from 'vitest';

import { TILE_SIZE } from '../map/TileMap';
import {
  exceedsSnapDistance,
  segmentDuration,
  segmentPosition,
} from './interpolation';

describe('segmentPosition', () => {
  it('advances linearly from the start to the target', () => {
    expect(segmentPosition(0, 100, 0, 50)).toBe(0);
    expect(segmentPosition(0, 100, 25, 50)).toBe(50);
    expect(segmentPosition(0, 100, 50, 50)).toBe(100);
  });

  it('keeps a constant velocity inside the segment', () => {
    // Misma distancia recorrida por cada fracción igual de tiempo:
    // es lo que la interpolación exponencial no cumplía.
    const first = segmentPosition(0, 12.8, 10, 50);
    const second = segmentPosition(0, 12.8, 20, 50);
    const third = segmentPosition(0, 12.8, 30, 50);

    expect(second - first).toBeCloseTo(third - second);
  });

  it('never overshoots when the next snapshot is late', () => {
    expect(segmentPosition(0, 100, 500, 50)).toBe(100);
    expect(segmentPosition(100, 0, 500, 50)).toBe(0);
  });

  it('treats a non-positive duration as a finished segment', () => {
    expect(segmentPosition(0, 100, 0, 0)).toBe(100);
    expect(segmentPosition(0, 100, 10, -5)).toBe(100);
  });

  it('starts at the origin when the age is negative', () => {
    expect(segmentPosition(0, 100, -10, 50)).toBe(0);
  });
});

describe('segmentDuration', () => {
  it('uses the measured interval when it is within bounds', () => {
    expect(segmentDuration(50)).toBe(50);
    expect(segmentDuration(30)).toBe(30);
  });

  it('clamps bursts and long pauses', () => {
    expect(segmentDuration(2)).toBe(25);
    expect(segmentDuration(5_000)).toBe(100);
  });
});

describe('exceedsSnapDistance', () => {
  it('keeps interpolating small moves', () => {
    expect(exceedsSnapDistance(0, 0, 0, TILE_SIZE)).toBe(false);
    expect(exceedsSnapDistance(0, 0, 0, 0)).toBe(false);
  });

  it('does not snap at exactly two tiles', () => {
    expect(exceedsSnapDistance(0, 0, 0, TILE_SIZE * 2)).toBe(false);
  });

  it('snaps a teleport beyond two tiles', () => {
    expect(exceedsSnapDistance(0, 0, 0, TILE_SIZE * 2 + 1)).toBe(true);
    expect(exceedsSnapDistance(TILE_SIZE * 4, 0, 0, 0)).toBe(true);
  });
});
