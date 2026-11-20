import type { PowerUpType } from '@transcendence/shared';
import { describe, expect, it } from 'vitest';

import { powerUpTextureName } from './powerUpTexture';

describe('powerUpTextureName', () => {
  it('maps every known power-up type to its texture', () => {
    expect(powerUpTextureName('EXTRA_BOMB')).toBe('powerUpExtraBomb');
    expect(powerUpTextureName('BLAST_RADIUS')).toBe('powerUpBlastRadius');
    expect(powerUpTextureName('SPEED')).toBe('powerUpSpeed');
  });

  it('returns null for an unknown type instead of throwing', () => {
    const unknown = 'SHIELD' as unknown as PowerUpType;

    expect(powerUpTextureName(unknown)).toBeNull();
  });
});
