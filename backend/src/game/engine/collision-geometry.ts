import type { Position, WorldPosition } from '@transcendence/shared';

export const PLAYER_HALF_SIZE = 0.3;

const EPSILON = 1e-9;

/**
 * Las casillas ocupan:
 * [tile.x, tile.x + 1] × [tile.y, tile.y + 1]
 *
 * Los jugadores tienen una hitbox cuadrada centrada
 * en su posición continua.
 */
export function overlapsTile(position: WorldPosition, tile: Position): boolean {
  const left = position.x - PLAYER_HALF_SIZE + EPSILON;
  const right = position.x + PLAYER_HALF_SIZE - EPSILON;
  const top = position.y - PLAYER_HALF_SIZE + EPSILON;
  const bottom = position.y + PLAYER_HALF_SIZE - EPSILON;

  return (
    right > tile.x && left < tile.x + 1 && bottom > tile.y && top < tile.y + 1
  );
}
