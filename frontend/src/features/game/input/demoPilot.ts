import type {
  BombSnapshot,
  ExplosionSnapshot,
  GamePlayerSnapshot,
  MovementInput,
} from '@transcendence/shared';

import { EXPLOSION_MS, FUSE_MS } from '../bombs/demoBombs';
import { DemoWorld } from '../demo/demoWorld';
import { TileType } from '../map/types';

// Igual que el stat `speed` del fixture (tiles por segundo): el
// piloto lee `player.speed` en cada paso, que los power-ups
// SPEED incrementan.
const SPEED_TILES_PER_SECOND = 4;
const PLAYER_HALF_SIZE = 0.4;
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
 * teclas del `KeyboardController` con movimiento cardinal y
 * gestiona sus bombas. Es la costura futura del socket: cuando llegue
 * `game:input`, el controller hablará con el servidor en lugar
 * de con este piloto.
 */
export class DemoPilot {
  private readonly world: DemoWorld;
  /** Todos los jugadores del fixture: con ellos se registran las bombas. */
  private readonly players: GamePlayerSnapshot[];
  private readonly localPlayer: GamePlayerSnapshot;

  private movement: MovementInput = STOPPED;
  private bombs: BombSnapshot[] = [];
  private explosions: ExplosionSnapshot[] = [];
  private lastNowMs = 0;
  private moved = false;
  private changed = false;
  private nextBombIndex = 0;

  constructor(
    world: DemoWorld,
    players: GamePlayerSnapshot[],
    localPlayerId: string
  ) {
    const localPlayer = players.find((player) => player.id === localPlayerId);

    if (!localPlayer) {
      throw new Error(`[DemoPilot] Local player not found: ${localPlayerId}`);
    }

    this.world = world;
    this.players = players;
    this.localPlayer = localPlayer;
  }

  setMovement(movement: MovementInput): void {
    const activeDirections =
      Number(movement.up) +
      Number(movement.down) +
      Number(movement.left) +
      Number(movement.right);

    // La demo aplica la misma regla que el servidor: una o ninguna
    // dirección activa. Un input diagonal se descarta por completo.
    this.movement =
      activeDirections > 1
        ? STOPPED
        : {
            up: movement.up,
            down: movement.down,
            left: movement.left,
            right: movement.right,
          };
  }

  placeBomb(): void {
    if (!this.localPlayer.alive) {
      return;
    }

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

    const bomb: BombSnapshot = {
      id: `pilot-bomb-${this.nextBombIndex++}`,
      ownerId: this.localPlayer.id,
      position: tile,
      detonateAt: this.lastNowMs + FUSE_MS,
      blastRadius: this.localPlayer.blastRadius,
    };

    this.bombs.push(bomb);
    // La bomba es sólida: quien la pisa al colocarla puede
    // salir, pero nadie más puede cruzarla (backend).
    this.world.registerBomb(bomb, this.players);
    this.changed = true;
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

  /**
   * true si desde el último consumo cambió alguna de las listas
   * (colocación, detonación o expiración): permite a la vista
   * repintar solo cuando hay algo nuevo.
   */
  consumeChanged(): boolean {
    const changed = this.changed;
    this.changed = false;
    return changed;
  }

  update(
    nowMs: number,
    deltaMs: number,
    externalExplosions: readonly ExplosionSnapshot[] = []
  ): void {
    this.lastNowMs = nowMs;

    if (this.localPlayer.alive) {
      this.moveLocalPlayer(Math.min(deltaMs, MAX_STEP_MS));
    }

    // Tras cada intento de movimiento: el pase se suelta en
    // cuanto el jugador deja de pisar la bomba (como
    // `releaseBombPassThrough` del backend).
    this.world.releasePassThrough(
      this.localPlayer.id,
      this.localPlayer.position
    );

    this.processBombs(nowMs);
    this.checkDeath(nowMs, externalExplosions);
  }

  private moveLocalPlayer(deltaMs: number): void {
    if (!this.localPlayer.alive) {
      return;
    }

    const { movement, localPlayer } = this;

    const directionX = Number(movement.right) - Number(movement.left);
    const directionY = Number(movement.down) - Number(movement.up);

    // La demo tampoco permite diagonales, incluso si recibe un input
    // que no procede del KeyboardController.
    if (
      (directionX !== 0 && directionY !== 0) ||
      (directionX === 0 && directionY === 0)
    ) {
      return;
    }

    const distance = (SPEED_TILES_PER_SECOND * deltaMs) / 1000;
    const dx = directionX * distance;
    const dy = directionY * distance;

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

  // Una explosión activa sobre la casilla del jugador local
  // lo elimina (igual que el backend resuelve el daño).
  private checkDeath(
    nowMs: number,
    externalExplosions: readonly ExplosionSnapshot[]
  ): void {
    const { localPlayer } = this;

    if (!localPlayer.alive) {
      return;
    }

    const tile = {
      x: Math.floor(localPlayer.position.x),
      y: Math.floor(localPlayer.position.y),
    };

    const coversTile = (cells: readonly { x: number; y: number }[]): boolean =>
      cells.some((cell) => cell.x === tile.x && cell.y === tile.y);

    const hit =
      this.explosions.some(
        (explosion) =>
          nowMs < explosion.expiresAt && coversTile(explosion.cells)
      ) ||
      externalExplosions.some(
        (explosion) =>
          nowMs < explosion.expiresAt && coversTile(explosion.cells)
      );

    if (hit) {
      localPlayer.alive = false;
      this.movement = STOPPED;
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
        if (this.world.map[tileY]?.[tileX] !== TileType.FLOOR) {
          return true;
        }
      }
    }

    // Las bombas registradas en el mundo también son sólidas.
    return this.world.blocksPlayer(this.localPlayer.id, x, y);
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

    if (detonated.length > 0) {
      this.changed = true;
    }

    for (const bomb of detonated) {
      // La bomba deja de bloquear y el mundo quema las cajas.
      this.world.forgetBomb(bomb.id);
      this.explosions.push({
        id: `${bomb.id}:explosion`,
        cells: this.world.detonate(bomb),
        expiresAt: bomb.detonateAt + EXPLOSION_MS,
      });
    }

    const explosionsBefore = this.explosions.length;

    this.explosions = this.explosions.filter(
      (explosion) => nowMs < explosion.expiresAt
    );

    if (this.explosions.length < explosionsBefore) {
      this.changed = true;
    }
  }
}
