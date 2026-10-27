export type GameMode = 'practice' | 'private' | 'public';

export type MapId = 'red_map' | 'blue_map' | 'green_map';

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
