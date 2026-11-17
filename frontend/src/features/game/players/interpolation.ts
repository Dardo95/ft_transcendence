import { TILE_SIZE } from '../map/TileMap';

export const PLAYER_SNAP_DISTANCE_PX = TILE_SIZE * 2;

// Duración del tramo entre dos snapshots: el intervalo medido
// entre llegadas, acotado para que una ráfaga de paquetes no
// dispare el sprite y una pausa larga no lo deje en cámara lenta.
const MIN_SEGMENT_MS = 25;
const MAX_SEGMENT_MS = 100;

/**
 * Posición dentro de un tramo lineal entre dos snapshots.
 *
 * La interpolación es lineal (velocidad constante, la del
 * servidor) en vez de exponencial: perseguir la escalera de
 * 20 Hz con suavizado exponencial hacía ondular la velocidad
 * dentro de cada ciclo y se veía como pequeños tirones.
 *
 * `t` se acota a [0, 1]: si el siguiente snapshot tarda, el
 * sprite espera en el objetivo en vez de sobrepasarlo; un
 * `ageMs` negativo empieza en el origen.
 */
export function segmentPosition(
  from: number,
  to: number,
  ageMs: number,
  durationMs: number
): number {
  const t = durationMs <= 0 ? 1 : Math.min(1, Math.max(0, ageMs / durationMs));

  return from + (to - from) * t;
}

/**
 * Duración de la reproducción del par: intervalo medido entre
 * llegadas, con tope.
 */
export function segmentDuration(intervalMs: number): number {
  return Math.min(MAX_SEGMENT_MS, Math.max(MIN_SEGMENT_MS, intervalMs));
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
