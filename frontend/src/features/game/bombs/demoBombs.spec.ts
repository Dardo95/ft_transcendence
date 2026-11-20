import { describe, expect, it } from 'vitest';

import { demoBombStateAt } from './demoBombs';

// Ciclo = 2500 mecha + 500 explosión + 500 pausa = 3500 ms.
const FUSE_MS = 2500;
const EXPLOSION_END_MS = 3000;
const CYCLE_MS = 3500;

describe('demoBombStateAt', () => {
  it('has a bomb and no explosion while the fuse burns', () => {
    const state = demoBombStateAt(1000);

    expect(state.bombs).toHaveLength(1);
    expect(state.explosions).toHaveLength(0);
  });

  it('detonates at the end of the fuse', () => {
    const state = demoBombStateAt(FUSE_MS - 1);

    expect(state.bombs).toHaveLength(1);
    expect(state.explosions).toHaveLength(0);
  });

  it('replaces the bomb with an explosion', () => {
    const state = demoBombStateAt(FUSE_MS + 100);

    expect(state.bombs).toHaveLength(0);
    expect(state.explosions).toHaveLength(1);
    expect(state.explosions[0].cells.length).toBeGreaterThanOrEqual(4);
  });

  it('goes idle after the explosion expires', () => {
    const state = demoBombStateAt(EXPLOSION_END_MS + 100);

    expect(state.bombs).toHaveLength(0);
    expect(state.explosions).toHaveLength(0);
  });

  it('starts a new cycle at a different spot', () => {
    const first = demoBombStateAt(100);
    const second = demoBombStateAt(CYCLE_MS + 100);

    expect(first.bombs[0].id).not.toBe(second.bombs[0].id);
    expect(first.bombs[0].position).not.toEqual(second.bombs[0].position);
  });

  it('keeps detonateAt and expiresAt consistent with the schedule', () => {
    const bomb = demoBombStateAt(0).bombs[0];
    const explosion = demoBombStateAt(FUSE_MS + 100).explosions[0];

    expect(bomb.detonateAt).toBe(FUSE_MS);
    expect(explosion.expiresAt).toBe(EXPLOSION_END_MS);
  });
});
