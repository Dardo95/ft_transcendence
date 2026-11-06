import type {
  BombSnapshot,
  ExplosionSnapshot,
  GamePlayerSnapshot,
  MovementInput,
} from '@transcendence/shared';

import { crossCellsAt } from '../bombs/crossCells';
import { EXPLOSION_MS, FUSE_MS } from '../bombs/demoBombs';
import { TileType } from '../map/types';

// Igual que el stat `speed` del fixture (tiles por segundo).
const SPEED_TILES_PER_SECOND = 4;
const PLAYER_HALF_SIZE = 0.4;
const INV_SQRT_2 = Math.SQRT1_2;
// Tope de delta para que una pestaña suspendida no atraviese muros.
const MAX_STEP_MS = 50;

const STOPPED: MovementInput = {
  up: false,
  down: false,
  left: false,
  right: false,
};

/**
 * Controla un jugador local en el demo: aplica el estado de
 * teclas del `KeyboardController` con la misma normalización
 * diagonal que el backend y gestiona sus bombas (mecha → cruz →
 * fin). Es la costura futura del socket: cuando llegue
 * `game:input`, el controller hablará con el servidor en lugar
 * de con este piloto.
 */
export class DemoPilot {
  private readonly map: number[][];
  private readonly localPlayer: GamePlayerSnapshot;

  private movement: MovementInput = STOPPED;
  private bombs: BombSnapshot[] = [];
  private explosions: ExplosionSnapshot[] = [];
  private lastNowMs = 0;
  private moved = false;
  private nextBombIndex = 0;

  constructor(
    map: number[][],
    players: GamePlayerSnapshot[],
    localPlayerId: string
  ) {
    const localPlayer = players.find((player) => player.id === localPlayerId);

    if (!localPlayer) {
      throw new Error(`[DemoPilot] Local player not found: ${localPlayerId}`);
    }

    this.map = map;
    this.localPlayer = localPlayer;
  }

  setMovement(movement: MovementInput): void {
    this.movement = movement;
  }

  placeBomb(): void {
    const tile = {
      x: Math.floor(this.localPlayer.position.x),
      y: Math.floor(this.localPlayer.position.y),
    };

    const occupied = this.bombs.some(
      (bomb) => bomb.position.x === tile.x && bomb.position.y === tile.y
    );

    if (occupied) {
      return;
    }

    const active = this.bombs.filter(
      (bomb) => bomb.ownerId === this.localPlayer.id
    ).length;

    if (active >= this.localPlayer.bombCapacity) {
      return;
    }

    this.bombs.push({
      id: `pilot-bomb-${this.nextBombIndex++}`,
      ownerId: this.localPlayer.id,
      position: tile,
      detonateAt: this.lastNowMs + FUSE_MS,
      blastRadius: this.localPlayer.blastRadius,
    });
  }

  getBombs(): readonly BombSnapshot[] {
    return this.bombs;
  }

  getExplosions(): readonly ExplosionSnapshot[] {
    return this.explosions;
  }

  consumeMoved(): boolean {
    const moved = this.moved;
    this.moved = false;
    return moved;
  }

  update(nowMs: number, deltaMs: number): void {
    this.lastNowMs = nowMs;
    this.moveLocalPlayer(Math.min(deltaMs, MAX_STEP_MS));
    this.processBombs(nowMs);
  }

  private moveLocalPlayer(deltaMs: number): void {
    const { movement, localPlayer } = this;
    const movingHorizontally = movement.left !== movement.right;
    const movingVertically = movement.up !== movement.down;

    if (!movingHorizontally && !movingVertically) {
      return;
    }

    const distance = (SPEED_TILES_PER_SECOND * deltaMs) / 1000;
    let dx = (movingHorizontally ? (movement.right ? 1 : -1) : 0) * distance;
    let dy = (movingVertically ? (movement.down ? 1 : -1) : 0) * distance;

    // Misma normalización que el backend: la diagonal no
    // debe ser más rápida que un solo eje.
    if (dx !== 0 && dy !== 0) {
      dx *= INV_SQRT_2;
      dy *= INV_SQRT_2;
    }

    const position = localPlayer.position;

    // Eje por eje: si un eje está bloqueado, el otro se
    // desliza junto al muro (como hace el servidor).
    if (dx !== 0 && !this.collides(position.x + dx, position.y)) {
      position.x += dx;
      this.moved = true;
    }

    if (dy !== 0 && !this.collides(position.x, position.y + dy)) {
      position.y += dy;
      this.moved = true;
    }
  }

  private collides(x: number, y: number): boolean {
    const minTileX = Math.floor(x - PLAYER_HALF_SIZE);
    const maxTileX = Math.floor(x + PLAYER_HALF_SIZE);
    const minTileY = Math.floor(y - PLAYER_HALF_SIZE);
    const maxTileY = Math.floor(y + PLAYER_HALF_SIZE);

    for (let tileY = minTileY; tileY <= maxTileY; tileY++) {
      for (let tileX = minTileX; tileX <= maxTileX; tileX++) {
        // Fuera del mapa también colisiona (undefined !== FLOOR).
        if (this.map[tileY]?.[tileX] !== TileType.FLOOR) {
          return true;
        }
      }
    }

    return false;
  }

  private processBombs(nowMs: number): void {
    const detonated: BombSnapshot[] = [];

    this.bombs = this.bombs.filter((bomb) => {
      if (nowMs >= bomb.detonateAt) {
        detonated.push(bomb);
        return false;
      }

      return true;
    });

    for (const bomb of detonated) {
      this.explosions.push({
        id: `${bomb.id}:explosion`,
        cells: crossCellsAt(this.map, bomb.position, bomb.blastRadius),
        expiresAt: bomb.detonateAt + EXPLOSION_MS,
      });
    }

    this.explosions = this.explosions.filter(
      (explosion) => nowMs < explosion.expiresAt
    );
  }
}
