import type { BombSnapshot, GamePlayerSnapshot } from '@transcendence/shared';
// Igual que GAME_DEFAULTS.matchDurationMs del backend.
export const MATCH_DURATION_MS = 180_000;

export interface LocalHud {
  name: string;
  alive: boolean;
  bombCapacity: number;
  availableBombs: number;
  blastRadius: number;
  speed: number;
}

export interface RivalHud {
  name: string;
  alive: boolean;
}

export interface HudModel {
  local: LocalHud;
  rivals: RivalHud[];
  playersRemaining: number;
  clockMs: number;
}

/**
 * Estado de la tarjeta del jugador local: bombas disponibles
 * = capacidad menos las que sigue teniendo en el aire.
 */
export function buildLocalHud(
  players: readonly GamePlayerSnapshot[],
  bombs: readonly BombSnapshot[],
  localPlayerId: string
): LocalHud {
  const local = players.find((player) => player.id === localPlayerId);

  if (!local) {
    throw new Error(`[hudModel] Local player not found: ${localPlayerId}`);
  }

  const activeOwnBombs = bombs.filter(
    (bomb) => bomb.ownerId === localPlayerId
  ).length;

  return {
    name: local.displayName ?? local.id,
    alive: local.alive,
    bombCapacity: local.bombCapacity,
    availableBombs: Math.max(0, local.bombCapacity - activeOwnBombs),
    blastRadius: local.blastRadius,
    speed: local.speed,
  };
}

/** Rivales (sin el local), tope de 3 como en FRONTEND_STYLE. */
export function buildRivalHud(
  players: readonly GamePlayerSnapshot[],
  localPlayerId: string
): RivalHud[] {
  return players
    .filter((player) => player.id !== localPlayerId)
    .slice(0, 3)
    .map((player) => ({
      name: player.displayName ?? player.id,
      alive: player.alive,
    }));
}

export function countAlivePlayers(
  players: readonly GamePlayerSnapshot[]
): number {
  return players.filter((player) => player.alive).length;
}

/** Cuenta atrás: tiempo restante de la partida, sin bajar de 0. */
export function remainingMatchMs(
  elapsedMs: number,
  durationMs: number = MATCH_DURATION_MS
): number {
  return Math.max(0, durationMs - elapsedMs);
}

/** "MM:SS" con redondeo hacia arriba: 165 000 → "02:45". */
export function formatClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Modelo completo que consume el componente del HUD. */
export function buildHudModel(
  players: readonly GamePlayerSnapshot[],
  bombs: readonly BombSnapshot[],
  localPlayerId: string,
  elapsedMs: number,
  durationMs: number = MATCH_DURATION_MS
): HudModel {
  return {
    local: buildLocalHud(players, bombs, localPlayerId),
    rivals: buildRivalHud(players, localPlayerId),
    playersRemaining: countAlivePlayers(players),
    clockMs: remainingMatchMs(elapsedMs, durationMs),
  };
}
