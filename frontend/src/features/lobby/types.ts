export type GameMode = 'practice' | 'private' | 'public';

export type MapId = 'map1' | 'map2' | 'map3';

export interface GameSettings {
  initialBombs: number;
  initialSpeed: number;
  fuseTime: number; // en segundos
}

export interface MatchmakingPayload {
  mode: GameMode;
  mapId: MapId;
  settings: GameSettings;
}
