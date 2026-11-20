export interface CameraViewport {
  width: number;
  height: number;
}

export interface CameraTarget {
  /** Punto focal en píxeles (normalmente el centro del jugador local). */
  x: number;
  y: number;
}

/**
 * Desplazamiento de la escena (píxeles) para que el viewport
 * enfoque al jugador sin mostrar el vacío fuera del mapa:
 *
 * - Mapa más chico que el viewport → centrado (offset negativo).
 * - Mapa más grande → se sigue al foco con clamp en los bordes.
 *
 * Función pura: sin estado, fácil de testear eje por eje.
 */
export function computeSceneOffset(
  mapWidth: number,
  mapHeight: number,
  viewport: CameraViewport,
  target: CameraTarget
): { x: number; y: number } {
  return {
    x: computeAxisOffset(mapWidth, viewport.width, target.x),
    y: computeAxisOffset(mapHeight, viewport.height, target.y),
  };
}

function computeAxisOffset(
  mapSize: number,
  viewportSize: number,
  focus: number
): number {
  // Mapa más chico (o igual): centrado, sin importar el foco.
  if (mapSize <= viewportSize) {
    return Math.round((viewportSize - mapSize) / 2);
  }

  // Mapa más grande: el foco al centro del viewport, pero
  // clampéado para que el borde del mapa nunca se meta en
  // pantalla (offset válido en [viewportSize - mapSize, 0]).
  const half = Math.round(viewportSize / 2);
  const clamped = clamp(focus, half, mapSize - half);
  return -clamped + half;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Interpolación exponencial independiente del framerate
 * (mismo enfoque que la interpolación de jugadores).
 */
export function approach(
  current: number,
  target: number,
  factor: number,
  deltaMs: number
): number {
  const t = 1 - Math.exp(-factor * (deltaMs / 1000));
  return current + (target - current) * t;
}
