import {
  GAME_DEFAULTS,
  type GameSettings as SharedGameSettings,
} from '@transcendence/shared';

export type GameMode = 'practice' | 'private' | 'public';

export type MapId = 'map1' | 'map2' | 'map3';

export type GameSettings = SharedGameSettings;

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  initialBombs: 1,
  initialSpeed: 1,
  fuseTime: GAME_DEFAULTS.defaultFuseTime,
};

/**
 * Nivel del lobby (1–3) → casillas/s que verá el jugador en
 * partida. Mismo mapeo que `resolveGameSettings` del backend,
 * para que el valor mostrado aquí coincida con el del HUD.
 */
export function speedTilesPerSecond(level: number): number {
  return GAME_DEFAULTS.defaultSpeedTilesPerSecond + (level - 1);
}

export interface MatchmakingPayload {
  mode: GameMode;
  mapId: MapId;
  settings: GameSettings;
}

export type MatchmakingStatus =
  'REQUESTING' | 'SEARCHING' | 'COUNTDOWN' | 'CANCELLED' | 'CREATED';

export interface MatchmakingState {
  mode: string;
  status: MatchmakingStatus;
  playerCount?: number;
  playersInCurrentMatch?: number;
  countdownEndsAt?: number;
}
