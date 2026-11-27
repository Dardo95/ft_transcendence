import {
  GAME_DEFAULTS,
  type BombSnapshot,
  type GamePlayerSnapshot,
} from '@transcendence/shared';

export const MATCH_DURATION_MS = GAME_DEFAULTS.matchDurationMs;

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
  local: LocalHud | null;
  rivals: RivalHud[];
  /** Full roster with stats (used by spectator fullscreen HUD). */
  players: LocalHud[];
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
  mapWidth?: number;
  mapHeight?: number;
  mapId?: string;
  gameId?: string;
}

/** Builds per-player HUD stats (available bombs, blast radius, speed). */
function buildPlayerHud(
  player: GamePlayerSnapshot,
  bombs: readonly BombSnapshot[]
): LocalHud {
  const activeOwnBombs = bombs.filter(
    (bomb) => bomb.ownerId === player.id
  ).length;

  return {
    id: player.id,
    name: player.displayName ?? player.id,
    isBot: player.isBot,
    alive: player.alive,
    bombCapacity: player.bombCapacity,
    availableBombs: Math.max(0, player.bombCapacity - activeOwnBombs),
    blastRadius: player.blastRadius,
    speed: player.speed,
  };
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

  return buildPlayerHud(local, bombs);
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
  localPlayerId: string | null,
  elapsedMs: number,
  {
    durationMs = MATCH_DURATION_MS,
    isOvertime = false,
    map,
    mapWidth,
    mapHeight,
    mapId = 'MAP1',
    gameId = 'demo',
  }: HudModelOptions = {}
): HudModel {
  const local =
    localPlayerId !== null
      ? buildLocalHud(players, bombs, localPlayerId)
      : null;
  const rivals =
    localPlayerId !== null
      ? buildRivalHud(players, localPlayerId)
      : players.slice(0, 4).map((player) => ({
          id: player.id,
          name: player.displayName ?? player.id,
          isBot: player.isBot,
          alive: player.alive,
        }));

  return {
    local,
    rivals,
    players: players.map((player) => buildPlayerHud(player, bombs)),
    playersRemaining: countAlivePlayers(players),
    clockMs: remainingMatchMs(elapsedMs, durationMs),
    isOvertime,
    overtimeElapsedMs: isOvertime ? Math.max(0, elapsedMs - durationMs) : 0,
    mapWidth: mapWidth ?? map?.[0]?.length ?? 0,
    mapHeight: mapHeight ?? map?.length ?? 0,
    mapId,
    gameId,
  };
}
