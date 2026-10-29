import type { MovementInput, WorldPosition } from '@transcendence/shared';

import { getTerrainAt } from './game-board.js';
import type { GamePlayer, GameSession } from './game-state.js';

import { overlapsTile, PLAYER_HALF_SIZE } from './collision-geometry.js';

export type MovementInputResult =
  | { success: true }
  | {
      success: false;
      reason:
        | 'PLAYER_NOT_FOUND'
        | 'PLAYER_DEAD'
        | 'GAME_NOT_RUNNING'
        | 'BOT_CONTROLLED';
    };

const COLLISION_EPSILON = 1e-9;

// Evita saltos excesivos por cada subpaso de movimiento.
const MAX_SUBSTEP_DISTANCE = 0.05;

const NO_MOVEMENT: MovementInput = {
  up: false,
  down: false,
  left: false,
  right: false,
};

export function setPlayerMovementInput(
  session: GameSession,
  playerId: string,
  input: MovementInput
): MovementInputResult {
  const player = session.players.get(playerId);

  if (!player) {
    return { success: false, reason: 'PLAYER_NOT_FOUND' };
  }

  if (player.isBot) {
    return { success: false, reason: 'BOT_CONTROLLED' };
  }

  if (!player.alive) {
    return { success: false, reason: 'PLAYER_DEAD' };
  }

  if (session.status !== 'RUNNING') {
    return { success: false, reason: 'GAME_NOT_RUNNING' };
  }

  player.movementInput = {
    up: input.up,
    down: input.down,
    left: input.left,
    right: input.right,
  };

  return { success: true };
}

function collidesWithObstacle(
  session: GameSession,
  playerId: string,
  x: number,
  y: number
): boolean {
  const position = { x, y };
  const board = session.board;

  const minTileX = Math.floor(x - PLAYER_HALF_SIZE + COLLISION_EPSILON);
  const maxTileX = Math.floor(x + PLAYER_HALF_SIZE - COLLISION_EPSILON);
  const minTileY = Math.floor(y - PLAYER_HALF_SIZE + COLLISION_EPSILON);
  const maxTileY = Math.floor(y + PLAYER_HALF_SIZE - COLLISION_EPSILON);

  // 1. Colisiones con muros y límites del tablero.
  for (let tileY = minTileY; tileY <= maxTileY; tileY++) {
    for (let tileX = minTileX; tileX <= maxTileX; tileX++) {
      const tile = { x: tileX, y: tileY };

      if (
        overlapsTile(position, tile) &&
        getTerrainAt(board, tileX, tileY) !== 'FLOOR'
      ) {
        return true;
      }
    }
  }

  // 2. Colisiones con bombas.
  for (const bomb of session.bombs.values()) {
    // Este jugador ya estaba dentro cuando se colocó
    // la bomba y aún no ha terminado de salir.
    if (bomb.passThroughPlayerIds.has(playerId)) {
      continue;
    }

    if (overlapsTile(position, bomb.position)) {
      return true;
    }
  }

  return false;
}

function movePlayerByDelta(
  session: GameSession,
  player: GamePlayer,
  deltaSeconds: number
): void {
  let directionX =
    Number(player.movementInput.right) - Number(player.movementInput.left);

  let directionY =
    Number(player.movementInput.down) - Number(player.movementInput.up);

  const magnitude = Math.hypot(directionX, directionY);

  if (magnitude === 0 || player.speedTilesPerSecond <= 0) {
    return;
  }

  // Normalizamos para que el movimiento diagonal no
  // sea más rápido que el horizontal o el vertical.
  directionX /= magnitude;
  directionY /= magnitude;

  const distance = player.speedTilesPerSecond * deltaSeconds;

  const steps = Math.max(1, Math.ceil(distance / MAX_SUBSTEP_DISTANCE));

  const stepX = (directionX * distance) / steps;
  const stepY = (directionY * distance) / steps;

  for (let i = 0; i < steps; i++) {
    // Resolver X e Y por separado permite deslizarse
    // junto a un muro cuando uno de los ejes está bloqueado.
    const nextX = player.position.x + stepX;

    if (!collidesWithObstacle(session, player.id, nextX, player.position.y)) {
      player.position.x = nextX;
    }

    const nextY = player.position.y + stepY;

    if (!collidesWithObstacle(session, player.id, player.position.x, nextY)) {
      player.position.y = nextY;
    }
  }
}

/**
 * Avanza el movimiento de los jugadores durante
 * deltaSeconds, expresado en segundos.
 *
 * El delta debe proceder del reloj del servidor,
 * no del cliente.
 */
export function updatePlayerMovement(
  session: GameSession,
  deltaSeconds: number
): void {
  if (session.status !== 'RUNNING') {
    return;
  }

  if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) {
    return;
  }

  for (const player of session.players.values()) {
    if (player.alive) {
      movePlayerByDelta(session, player, deltaSeconds);
    }

    releaseBombPassThrough(session, player);
  }
}

function releaseBombPassThrough(
  session: GameSession,
  player: GamePlayer
): void {
  for (const bomb of session.bombs.values()) {
    if (
      bomb.passThroughPlayerIds.has(player.id) &&
      !overlapsTile(player.position, bomb.position)
    ) {
      bomb.passThroughPlayerIds.delete(player.id);
    }
  }
}
