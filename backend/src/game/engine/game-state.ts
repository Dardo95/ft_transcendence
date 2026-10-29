import type {
  GameMode,
  GameStatus,
  MovementInput,
  Position,
  PowerUpType,
  TerrainType,
  WorldPosition,
} from '@transcendence/shared';

export interface GameBoard {
  id: string;
  width: number;
  height: number;
  tiles: TerrainType[][];
  spawnPoints: Record<number, Position>;
}

export interface GamePlayer {
  id: string;
  userId?: string;
  displayName: string;
  isBot: boolean;

  position: WorldPosition;
  alive: boolean;

  speedTilesPerSecond: number;
  bombCapacity: number;
  blastRadius: number;

  activeBombIds: Set<string>;

  movementInput: MovementInput;
}

export interface BombState {
  id: string;
  ownerId: string;

  // Coordenadas enteras de la casilla que ocupa.
  position: Position;

  placedAtMs: number;
  detonateAtMs: number;
  blastRadius: number;

  // Jugadores que ya estaban dentro de la bomba
  // cuando apareció y pueden salir de ella.
  passThroughPlayerIds: Set<string>;
}

export interface ActiveExplosionState {
  id: string;
  cells: Position[];
  expiresAtMs: number;
}

export interface PowerUpState {
  id: string;
  type: PowerUpType;
  position: Position;
}

export interface GameSession {
  id: string;
  mode: GameMode;
  status: GameStatus;

  board: GameBoard;
  players: Map<string, GamePlayer>;
  bombs: Map<string, BombState>;
  explosions: Map<string, ActiveExplosionState>;
  powerUps: Map<string, PowerUpState>;

  createdAtMs: number;
  startedAtMs: number | null;
  finishedAtMs: number | null;

  winnerId: string | null;
}
