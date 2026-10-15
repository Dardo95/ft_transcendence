export interface PlayerDTO {
  id: string;
  x: number;
  y: number;
  alive: boolean;
}

export interface BombDTO {
  id: string;
  x: number;
  y: number;
  radius: number;
}

export interface GameState {
  roomId: string;
  players: PlayerDTO[];
  bombs: BombDTO[];
  status: "LOBBY" | "RUNNING" | "FINISHED";
}
