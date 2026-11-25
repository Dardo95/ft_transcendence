import { PLAYER_COLORS, type PlayerColor } from '../players/types';

// Mismos colores que los sprites de jugadores del canvas
// (PLAYER_COLORS), para que el gorrito del HUD coincida con el
// personaje que se ve en el tablero.
export const PLAYER_COLOR_CLASSES: Record<PlayerColor, string> = {
  blue: 'bg-blue-950 text-blue-300 border-blue-700',
  green: 'bg-emerald-950 text-emerald-300 border-emerald-700',
  red: 'bg-red-950 text-red-300 border-red-700',
  yellow: 'bg-yellow-950 text-yellow-300 border-yellow-700',
};

/** Subrayado de color bajo la fila de cada jugador. */
export const PLAYER_COLOR_UNDERLINE_CLASSES: Record<PlayerColor, string> = {
  blue: 'border-b-blue-700',
  green: 'border-b-emerald-700',
  red: 'border-b-red-700',
  yellow: 'border-b-yellow-700',
};

/**
 * Replica PlayerLayer.assignColor: primer color libre en orden
 * de aparición. El roster va en el mismo orden que el array de
 * jugadores del canvas, así el gorrito coincide con el
 * personaje del tablero (bren=blue, eduardo=green…).
 */
export function assignRosterColors<T extends object>(
  entries: readonly T[]
): (T & { color: PlayerColor })[] {
  const used = new Set<PlayerColor>();

  return entries.map((entry) => {
    const color =
      PLAYER_COLORS.find((item) => !used.has(item)) ?? PLAYER_COLORS[0];
    used.add(color);
    return { ...entry, color };
  });
}
