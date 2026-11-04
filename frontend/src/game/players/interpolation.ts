import { TILE_SIZE } from '../map/TileMap';

const SMOOTHING_SPEED = 20;
const MAX_DELTA_MS = 250;

export const PLAYER_SNAP_DISTANCE_PX = TILE_SIZE * 2;

export function smoothTowards(
  current: number,
  target: number,
  deltaMs: number,
  speed = SMOOTHING_SPEED
): number {
  const clampedDelta = Math.min(Math.max(deltaMs, 0), MAX_DELTA_MS);
  const factor = 1 - Math.exp((-speed * clampedDelta) / 1000);

  return current + (target - current) * factor;
}

export function exceedsSnapDistance(
  currentX: number,
  currentY: number,
  targetX: number,
  targetY: number,
  maxDistance = PLAYER_SNAP_DISTANCE_PX
): boolean {
  const dx = targetX - currentX;
  const dy = targetY - currentY;

  return dx * dx + dy * dy > maxDistance * maxDistance;
}
