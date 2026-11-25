import { GAME_DEFAULTS } from '@transcendence/shared';
import { describe, expect, it } from 'vitest';

import { speedTilesPerSecond } from './types';

const BASE = GAME_DEFAULTS.defaultSpeedTilesPerSecond;

describe('speedTilesPerSecond', () => {
  it('maps lobby level 1 to the engine default speed', () => {
    expect(speedTilesPerSecond(1)).toBe(BASE);
  });

  it('increments one tile per second per level', () => {
    expect(speedTilesPerSecond(2)).toBe(BASE + 1);
    expect(speedTilesPerSecond(3)).toBe(BASE + 2);
  });
});
