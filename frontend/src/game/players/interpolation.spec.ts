import { describe, expect, it } from 'vitest';

import { TILE_SIZE } from '../map/TileMap';
import { exceedsSnapDistance, smoothTowards } from './interpolation';

function simulate(totalMs: number, frameMs: number, target = 100): number {
  let value = 0;
  let elapsed = 0;

  while (elapsed < totalMs) {
    value = smoothTowards(value, target, frameMs);
    elapsed += frameMs;
  }

  return value;
}

describe('smoothTowards', () => {
  it('approaches the target without ever overshooting', () => {
    const value = simulate(2000, 16);

    expect(value).toBeGreaterThan(99);
    expect(value).toBeLessThanOrEqual(100);
  });

  it('reaches nearly the same position at 60 and 30 fps', () => {
    const at60 = simulate(1000, 16.67);
    const at30 = simulate(1000, 33.33);

    expect(Math.abs(at60 - at30)).toBeLessThan(1);
  });

  it('clamps very long deltas instead of jumping', () => {
    const value = smoothTowards(0, 10, 10_000);

    expect(value).toBeGreaterThan(9.9);
    expect(value).toBeLessThan(10);
  });

  it('stays still when there is no elapsed time', () => {
    expect(smoothTowards(5, 10, 0)).toBe(5);
    expect(smoothTowards(5, 10, -50)).toBe(5);
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
