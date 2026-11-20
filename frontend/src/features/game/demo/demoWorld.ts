import type {
  ExplosionSnapshot,
  GamePlayerSnapshot,
  Position,
  PowerUpSnapshot,
  PowerUpType,
} from '@transcendence/shared';

import { crossCellsAt } from '../bombs/crossCells';
import { TileType } from '../map/types';

// Mismos valores que `GAME_DEFAULTS` del backend.
const POWER_UP_DROP_CHANCE = 0.25;
const MAX_BOMB_CAPACITY = 5;
const MAX_BLAST_RADIUS = 8;
const MAX_SPEED_TILES_PER_SECOND = 7;
const SPEED_POWER_UP_INCREMENT = 0.5;

const POWER_UP_TYPES: PowerUpType[] = ['EXTRA_BOMB', 'BLAST_RADIUS', 'SPEED'];

// Hitbox de recogida: la del backend (0.3), no la del piloto.
const PICKUP_HALF_SIZE = 0.3;
const EPSILON = 1e-9;
// Hitbox de solidez: la misma que la colisión de muros del
// piloto (0.4), para que una bomba bloquee como un muro.
const SOLID_HALF_SIZE = 0.4;

/** Bomba registrada: su casilla + quién puede salir de ella. */
interface DemoBomb {
  position: Position;
  passThrough: Set<string>;
}

export interface DemoWorldOptions {
  /** RNG inyectado: en producción `Math.random`, en tests una secuencia. */
  random?: () => number;
}

function overlapsTile(
  position: { x: number; y: number },
  tile: Position
): boolean {
  const left = position.x - PICKUP_HALF_SIZE + EPSILON;
  const right = position.x + PICKUP_HALF_SIZE - EPSILON;
  const top = position.y - PICKUP_HALF_SIZE + EPSILON;
  const bottom = position.y + PICKUP_HALF_SIZE - EPSILON;

  return (
    right > tile.x && left < tile.x + 1 && bottom > tile.y && top < tile.y + 1
  );
}

function sameTile(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

/** true si la hitbox del jugador en `position` toca la casilla. */
function bombOverlaps(
  position: { x: number; y: number },
  bomb: Position
): boolean {
  const minTileX = Math.floor(position.x - SOLID_HALF_SIZE);
  const maxTileX = Math.floor(position.x + SOLID_HALF_SIZE);
  const minTileY = Math.floor(position.y - SOLID_HALF_SIZE);
  const maxTileY = Math.floor(position.y + SOLID_HALF_SIZE);

  return (
    bomb.x >= minTileX &&
    bomb.x <= maxTileX &&
    bomb.y >= minTileY &&
    bomb.y <= maxTileY
  );
}

function isInActiveFlame(
  position: { x: number; y: number },
  explosions: readonly ExplosionSnapshot[],
  nowMs: number
): boolean {
  return explosions.some(
    (explosion) =>
      nowMs < explosion.expiresAt &&
      explosion.cells.some((cell) => overlapsTile(position, cell))
  );
}

function applyPowerUp(player: GamePlayerSnapshot, type: PowerUpType): void {
  switch (type) {
    case 'EXTRA_BOMB':
      player.bombCapacity = Math.min(
        MAX_BOMB_CAPACITY,
        player.bombCapacity + 1
      );
      break;
    case 'BLAST_RADIUS':
      player.blastRadius = Math.min(MAX_BLAST_RADIUS, player.blastRadius + 1);
      break;
    case 'SPEED':
      player.speed = Math.min(
        MAX_SPEED_TILES_PER_SECOND,
        player.speed + SPEED_POWER_UP_INCREMENT
      );
      break;
  }
}

/**
 * Estado del mundo de la demo (GAME-F-13): el mapa vivo, los
 * power-ups que soltaron las cajas destruidas y las bombas ya
 * colocadas (sólidas, con el pase de quien estaba dentro).
 * Bren y los bots comparten una única instancia.
 *
 * Reproduce las reglas de `explosion-system`, `powerup-system`
 * y `movement-system` del backend (caja quemada incluida en la
 * cruz, 25 % de drop, topes de mejora, recogida solo fuera de
 * la llama, bombas que no se pueden cruzar) con el RNG
 * inyectado para los tests. No encadena bombas.
 */
export class DemoWorld {
  /** Copia privada: `testMap` (módulo) nunca se muta. */
  readonly map: number[][];
  private powerUps: PowerUpSnapshot[] = [];
  /** Bombas vivas por id, con quién puede salir de cada una. */
  private readonly bombs = new Map<string, DemoBomb>();
  private mapChanged = false;
  private powerUpsChanged = false;
  private nextPowerUpId = 0;
  private readonly random: () => number;

  constructor(sourceMap: number[][], options: DemoWorldOptions = {}) {
    this.map = sourceMap.map((row) => [...row]);
    this.random = options.random ?? Math.random;
  }

  getPowerUps(): readonly PowerUpSnapshot[] {
    return this.powerUps;
  }

  /**
   * Registra una bomba recién colocada. Los jugadores vivos que
   * pisan la casilla pueden salir pero no volver a entrar
   * (misma regla que `passThroughPlayerIds` del backend).
   *
   * El solape se evalúa con la misma hitbox que `blocksPlayer`,
   * para que nadie quede atrapado dentro de una bomba que no
   * puede ni cruzar ni abandonar.
   */
  registerBomb(
    bomb: { id: string; position: Position },
    players: readonly GamePlayerSnapshot[]
  ): void {
    const passThrough = new Set<string>();

    for (const player of players) {
      if (player.alive && bombOverlaps(player.position, bomb.position)) {
        passThrough.add(player.id);
      }
    }

    this.bombs.set(bomb.id, {
      position: { ...bomb.position },
      passThrough,
    });
  }

  /** La bomba ya no existe (detonó): deja de bloquear. */
  forgetBomb(bombId: string): void {
    this.bombs.delete(bombId);
  }

  /**
   * true si alguna bomba registrada bloquea al jugador en la
   * posición candidata: los que estaban dentro al colocarla
   * pueden salir, los demás no pasan.
   */
  blocksPlayer(playerId: string, x: number, y: number): boolean {
    const position = { x, y };

    for (const bomb of this.bombs.values()) {
      if (bomb.passThrough.has(playerId)) {
        continue;
      }

      if (bombOverlaps(position, bomb.position)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Suelta el pase de las bombas que el jugador ya no pisa:
   * una vez fuera no puede volver a entrar (como
   * `releaseBombPassThrough` del backend).
   */
  releasePassThrough(playerId: string, position: Position): void {
    for (const bomb of this.bombs.values()) {
      if (
        bomb.passThrough.has(playerId) &&
        !bombOverlaps(position, bomb.position)
      ) {
        bomb.passThrough.delete(playerId);
      }
    }
  }

  /**
   * Aplica la explosión de una bomba: quema las cajas de las
   * celdas alcanzadas y, por cada una, tira a ver si suelta un
   * power-up. Devuelve las celdas de la explosión (las cajas
   * ya no están: el mapa queda listo para la colisión).
   */
  detonate(bomb: { position: Position; blastRadius: number }): Position[] {
    const cells = crossCellsAt(this.map, bomb.position, bomb.blastRadius);
    const destroyed: Position[] = [];

    for (const cell of cells) {
      if (this.map[cell.y]?.[cell.x] === TileType.BLOCK) {
        this.map[cell.y][cell.x] = TileType.FLOOR;
        destroyed.push(cell);
      }
    }

    if (destroyed.length > 0) {
      this.mapChanged = true;
    }

    this.spawnPowerUps(destroyed);

    return cells;
  }

  /**
   * Recoge los power-ups solapados por jugadores vivos que no
   * estén dentro de una llama activa (reglas del backend).
   *
   * Una casilla de caja destruida no puede tener bomba encima
   * (las bombas solo se colocan en piso), así que el drop nunca
   * choca con una bomba.
   */
  collect(
    players: readonly GamePlayerSnapshot[],
    explosions: readonly ExplosionSnapshot[],
    nowMs: number
  ): void {
    if (this.powerUps.length === 0) {
      return;
    }

    for (const player of players) {
      if (
        !player.alive ||
        isInActiveFlame(player.position, explosions, nowMs)
      ) {
        continue;
      }

      // Hacia atrás: se borra mientras se itera la lista.
      for (let i = this.powerUps.length - 1; i >= 0; i--) {
        const powerUp = this.powerUps[i];

        if (!overlapsTile(player.position, powerUp.position)) {
          continue;
        }

        applyPowerUp(player, powerUp.type);
        this.powerUps.splice(i, 1);
        this.powerUpsChanged = true;
      }
    }
  }

  /** true si el mapa cambió desde el último consumo. */
  consumeMapChanged(): boolean {
    const changed = this.mapChanged;
    this.mapChanged = false;
    return changed;
  }

  /** true si la lista de power-ups cambió desde el último consumo. */
  consumePowerUpsChanged(): boolean {
    const changed = this.powerUpsChanged;
    this.powerUpsChanged = false;
    return changed;
  }

  private spawnPowerUps(destroyed: readonly Position[]): void {
    for (const tile of destroyed) {
      const occupied = this.powerUps.some((powerUp) =>
        sameTile(powerUp.position, tile)
      );

      if (occupied) {
        continue;
      }

      if (this.random() >= POWER_UP_DROP_CHANCE) {
        continue;
      }

      const index = Math.floor(this.random() * POWER_UP_TYPES.length);
      const type = POWER_UP_TYPES[index];

      this.powerUps.push({
        id: `demo-power-up-${this.nextPowerUpId++}`,
        type,
        position: { ...tile },
      });
      this.powerUpsChanged = true;
    }
  }
}
