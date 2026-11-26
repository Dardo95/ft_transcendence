import {
  GAME_DEFAULTS,
  type BombSnapshot,
  type GamePlayerSnapshot,
} from '@transcendence/shared';

export const MATCH_DURATION_MS = GAME_DEFAULTS.matchDurationMs;

/**
 * Aviso breve del HUD (se limpia solo tras `HUD_FLASH_MS`):
 * `statUp` al recoger un power-up, `bombRejected` cuando el
 * servidor rechaza una bomba por capacidad.
 */
export type HudFlash = 'statUp' | 'bombRejected';

export interface LocalHud {
  id: string;
  name: string;
  isBot: boolean;
  alive: boolean;
  bombCapacity: number;
  availableBombs: number;
  blastRadius: number;
  speed: number;
}

export interface RivalHud {
  id: string;
  name: string;
  isBot: boolean;
  alive: boolean;
}

export interface HudModel {
  local: LocalHud;
  rivals: RivalHud[];
  playersRemaining: number;
  clockMs: number;
  isOvertime: boolean;
  overtimeElapsedMs: number;
  mapWidth: number;
  mapHeight: number;
  mapId: string;
  gameId: string;
}

export interface HudModelOptions {
  durationMs?: number;
  isOvertime?: boolean;
  map?: readonly number[][];
  mapId?: string;
  gameId?: string;
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
    id: local.id,
    name: local.displayName ?? local.id,
    isBot: local.isBot,
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
      id: player.id,
      name: player.displayName ?? player.id,
      isBot: player.isBot,
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

/**
 * Reloj de la partida para el HUD: "MM:SS" durante el tiempo
 * regular y "+MM:SS" durante la muerte súbita. Lo comparten
 * el topbar y la caja de tiempo del HUD fullscreen.
 */
export function formatMatchClock(
  model: Pick<HudModel, 'clockMs' | 'isOvertime' | 'overtimeElapsedMs'>
): string {
  if (model.isOvertime) {
    return `+${formatClock(model.overtimeElapsedMs)}`;
  }

  return formatClock(model.clockMs);
}

/**
 * Aviso de muerte súbita: visible solo los primeros
 * `windowMs` de overtime, justo cuando el reloj regular
 * llega a 0 y empiezan a cerrar los muros.
 */
export function showSuddenDeathAlert(
  model: Pick<HudModel, 'isOvertime' | 'overtimeElapsedMs'>,
  windowMs = 5_000
): boolean {
  return model.isOvertime && model.overtimeElapsedMs < windowMs;
}

/**
 * Cuenta atrás de los últimos veinte segundos del tiempo
 * regular: el aviso aparece al abrirse la ventana de 20 s y
 * solo dura 5 s (se oculta al quedar menos de 15). Solo
 * antes del overtime.
 */
export function showFinalSecondsAlert(
  model: Pick<HudModel, 'isOvertime' | 'clockMs'>,
  thresholdMs = 20_000,
  windowMs = 5_000
): boolean {
  return (
    !model.isOvertime &&
    model.clockMs > thresholdMs - windowMs &&
    model.clockMs <= thresholdMs
  );
}

/** "MM:SS" con redondeo hacia arriba: 165 000 → "02:45". */
export function formatClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Modelo completo que consume el HUD (topbar + sidebar). */
export function buildHudModel(
  players: readonly GamePlayerSnapshot[],
  bombs: readonly BombSnapshot[],
  localPlayerId: string,
  elapsedMs: number,
  {
    durationMs = MATCH_DURATION_MS,
    isOvertime = false,
    map,
    mapId = 'MAP1',
    gameId = 'demo',
  }: HudModelOptions = {}
): HudModel {
  return {
    local: buildLocalHud(players, bombs, localPlayerId),
    rivals: buildRivalHud(players, localPlayerId),
    playersRemaining: countAlivePlayers(players),
    clockMs: remainingMatchMs(elapsedMs, durationMs),
    isOvertime,
    overtimeElapsedMs: isOvertime ? Math.max(0, elapsedMs - durationMs) : 0,
    mapWidth: map?.[0]?.length ?? 0,
    mapHeight: map?.length ?? 0,
    mapId,
    gameId,
  };
}
