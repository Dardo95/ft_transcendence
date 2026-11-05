import { randomUUID } from 'node:crypto';

import type { Position, PowerUpType } from '@transcendence/shared';

import { GAME_DEFAULTS } from '../config/game-defaults.js';
import { getTerrainAt } from './game-board.js';
import { overlapsTile } from './collision-geometry.js';
import type { GameSession, PowerUpState } from './game-state.js';

export interface PowerUpSystemOptions {
  random?: () => number;
  createId?: () => string;
}

export interface CollectedPowerUp {
  powerUpId: string;
  playerId: string;
  type: PowerUpType;
}

const POWER_UP_TYPES: PowerUpType[] = ['EXTRA_BOMB', 'BLAST_RADIUS', 'SPEED'];

function isActiveGame(session: GameSession): boolean {
  return session.status === 'RUNNING' || session.status === 'OVERTIME';
}

function isValidRandomValue(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value < 1;
}

function isTileOccupiedByBomb(
  session: GameSession,
  position: Position
): boolean {
  return [...session.bombs.values()].some(
    (bomb) => bomb.position.x === position.x && bomb.position.y === position.y
  );
}

function isTileOccupiedByPowerUp(
  session: GameSession,
  position: Position
): boolean {
  return [...session.powerUps.values()].some(
    (powerUp) =>
      powerUp.position.x === position.x && powerUp.position.y === position.y
  );
}

function isPlayerInsideActiveFlame(
  session: GameSession,
  playerId: string
): boolean {
  const player = session.players.get(playerId);

  if (!player) {
    return false;
  }

  for (const explosion of session.explosions.values()) {
    for (const cell of explosion.cells) {
      if (overlapsTile(player.position, cell)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Intenta generar power-ups en los muros que acaban
 * de destruirse.
 *
 * Debe llamarse después de updateBombsAndExplosions().
 */
export function spawnPowerUpsFromDestroyedWalls(
  session: GameSession,
  destroyedWalls: Position[],
  options: PowerUpSystemOptions = {}
): PowerUpState[] {
  if (!isActiveGame(session)) {
    return [];
  }

  const random = options.random ?? Math.random;
  const createId = options.createId ?? randomUUID;

  const spawned: PowerUpState[] = [];
  const visitedTiles = new Set<string>();

  for (const wall of destroyedWalls) {
    const key = `${wall.x},${wall.y}`;

    if (visitedTiles.has(key)) {
      continue;
    }

    visitedTiles.add(key);

    // Las mejoras solo aparecen en casillas de suelo.
    if (getTerrainAt(session.board, wall.x, wall.y) !== 'FLOOR') {
      continue;
    }

    if (
      isTileOccupiedByBomb(session, wall) ||
      isTileOccupiedByPowerUp(session, wall)
    ) {
      continue;
    }

    const dropRoll = random();

    if (!isValidRandomValue(dropRoll)) {
      throw new RangeError('Random source must return a value in [0, 1)');
    }

    if (dropRoll >= GAME_DEFAULTS.powerUpDropChance) {
      continue;
    }

    const typeRoll = random();

    if (!isValidRandomValue(typeRoll)) {
      throw new RangeError('Random source must return a value in [0, 1)');
    }

    const typeIndex = Math.floor(typeRoll * POWER_UP_TYPES.length);

    const id = createId();

    if (!id.trim() || session.powerUps.has(id)) {
      throw new Error(`Invalid or duplicate power-up ID: ${id}`);
    }

    const powerUp: PowerUpState = {
      id,
      type: POWER_UP_TYPES[typeIndex],
      position: { ...wall },
    };

    session.powerUps.set(id, powerUp);
    spawned.push(powerUp);
  }

  return spawned;
}

/**
 * Recoge los power-ups solapados por la hitbox
 * de un jugador vivo.
 *
 * Las mejoras no se pueden recoger mientras
 * el jugador esté dentro de una llama activa.
 */
export function collectPowerUps(session: GameSession): CollectedPowerUp[] {
  if (!isActiveGame(session)) {
    return [];
  }

  const collected: CollectedPowerUp[] = [];

  for (const player of session.players.values()) {
    if (!player.alive || isPlayerInsideActiveFlame(session, player.id)) {
      continue;
    }

    for (const powerUp of session.powerUps.values()) {
      if (!overlapsTile(player.position, powerUp.position)) {
        continue;
      }

      switch (powerUp.type) {
        case 'EXTRA_BOMB':
          player.bombCapacity = Math.min(
            GAME_DEFAULTS.maxBombCapacity,
            player.bombCapacity + 1
          );
          break;

        case 'BLAST_RADIUS':
          player.blastRadius = Math.min(
            GAME_DEFAULTS.maxBlastRadius,
            player.blastRadius + 1
          );
          break;

        case 'SPEED':
          player.speedTilesPerSecond = Math.min(
            GAME_DEFAULTS.maxSpeedTilesPerSecond,
            player.speedTilesPerSecond + GAME_DEFAULTS.speedPowerUpIncrement
          );
          break;
      }

      // Eliminar antes de continuar impide que el mismo
      // power-up se recoja más de una vez.
      session.powerUps.delete(powerUp.id);

      collected.push({
        powerUpId: powerUp.id,
        playerId: player.id,
        type: powerUp.type,
      });
    }
  }

  return collected;
}
