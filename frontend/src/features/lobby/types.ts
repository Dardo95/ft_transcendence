import type { GameSettings as SharedGameSettings } from '@transcendence/shared';

export type GameMode = 'practice' | 'private' | 'public';

export type MapId = 'map1' | 'map2' | 'map3';

export type GameSettings = SharedGameSettings;

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  initialBombs: 1,
  initialSpeed: 1,
  fuseTime: 3,
};

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
