import type { PowerUpType } from '@transcendence/shared';

import type { FxTextureName } from './textures';

/**
 * Textura de cada power-up. Devuelve `null` para un tipo que la
 * app aún no conoce: la capa simplemente no lo pinta en vez de
 * romper.
 */
export function powerUpTextureName(type: PowerUpType): FxTextureName | null {
  switch (type) {
    case 'EXTRA_BOMB':
      return 'powerUpExtraBomb';
    case 'BLAST_RADIUS':
      return 'powerUpBlastRadius';
    case 'SPEED':
      return 'powerUpSpeed';
    default:
      return null;
  }
}
