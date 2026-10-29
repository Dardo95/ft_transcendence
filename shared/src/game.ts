export type GameMode =
  | 'PUBLIC'
  | 'PRIVATE'
  | 'PRACTICE';

export type GameStatus =
  | 'COUNTDOWN'
  | 'RUNNING'
  | 'OVERTIME'
  | 'FINISHED';

export type TerrainType =
  | 'FLOOR'
  | 'DESTRUCTIBLE'
  | 'INDESTRUCTIBLE';

export type PowerUpType =
  | 'EXTRA_BOMB'
  | 'BLAST_RADIUS'
  | 'SPEED';

export type Direction =
  | 'UP'
  | 'DOWN'
  | 'LEFT'
  | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

/**
 * Petición para solicitar una partida.
 * El servidor deberá validar estos datos.
 */
export interface MatchmakingRequest {
  mapId: string;
  mode: GameMode;
  settings?: Record<string, unknown>;
}

/**
 * Representación pública de un jugador.
 * No contiene datos privados de la cuenta.
 */
export interface GamePlayerSnapshot {
  id: string;
  displayName?: string;
  isBot: boolean;
  position: Position;
  alive: boolean;
  bombCapacity: number;
  blastRadius: number;
  speed: number;
}

/**
 * Representación pública del tablero.
 */
export interface BoardSnapshot {
  width: number;
  height: number;
  tiles: TerrainType[][];
}

export interface BombSnapshot {
  id: string;
  ownerId: string;
  position: Position;
  detonateAt: number;
  blastRadius: number;
}

export interface ExplosionSnapshot {
  id: string;
  cells: Position[];
  expiresAt: number;
}

export interface PowerUpSnapshot {
  id: string;
  type: PowerUpType;
  position: Position;
}

export interface GameSnapshot {
  gameId: string;
  mode: GameMode;
  status: GameStatus;
  elapsedMs: number;
  board: BoardSnapshot;
  players: GamePlayerSnapshot[];
  bombs: BombSnapshot[];
  explosions: ExplosionSnapshot[];
  powerUps: PowerUpSnapshot[];
  winnerId: string | null;
}

export interface WorldPosition {
  x: number;
  y: number;
}

export interface MovementInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}