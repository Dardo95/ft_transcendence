import type { MovementInput } from '@transcendence/shared';

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
        | 'BOT_CONTROLLED'
        | 'INVALID_MOVEMENT';
    };

const COLLISION_EPSILON = 1e-9;

function isActiveGame(session: GameSession): boolean {
  return session.status === 'RUNNING' || session.status === 'OVERTIME';
}

// Evita saltos excesivos por cada subpaso de movimiento.
const MAX_SUBSTEP_DISTANCE = 0.05;

// El mapa se renderiza con 64 píxeles por casilla. Si un jugador
// roza una esquina por unos pocos píxeles, permitimos alinearlo
// hacia el centro de su pasillo antes de rechazar el movimiento.
const WORLD_PIXELS_PER_TILE = 64;
const CORNER_CORRECTION_STEP = 1 / WORLD_PIXELS_PER_TILE;
const MAX_CORNER_CORRECTION = 4 / WORLD_PIXELS_PER_TILE;

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

  if (!isActiveGame(session)) {
    return { success: false, reason: 'GAME_NOT_RUNNING' };
  }

  const activeDirections =
    Number(input.up) +
    Number(input.down) +
    Number(input.left) +
    Number(input.right);

  if (activeDirections > 1) {
    return { success: false, reason: 'INVALID_MOVEMENT' };
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

/**
 * Intenta avanzar un subpaso cardinal. Si la hitbox choca justo
 * con la esquina de un bloque, busca una corrección perpendicular
 * de hasta cuatro píxeles hacia el centro de la casilla actual.
 * La corrección y el avance deben estar libres de colisión.
 */
function movePlayerStep(
  session: GameSession,
  player: GamePlayer,
  directionX: number,
  directionY: number,
  distance: number
): boolean {
  const nextX = player.position.x + directionX * distance;
  const nextY = player.position.y + directionY * distance;

  if (!collidesWithObstacle(session, player.id, nextX, nextY)) {
    player.position.x = nextX;
    player.position.y = nextY;
    return true;
  }

  // El eje perpendicular al movimiento es el único que podemos
  // corregir: nunca se introduce movimiento diagonal en el input.
  const perpendicularPosition =
    directionX !== 0 ? player.position.y : player.position.x;
  const perpendicularCenter = Math.floor(perpendicularPosition) + 0.5;
  const correctionDirection = Math.sign(
    perpendicularCenter - perpendicularPosition
  );

  // Ya estamos centrados en la casilla: no hay alineación pequeña
  // que pueda resolver este bloqueo sin cambiar de carril.
  if (correctionDirection === 0) {
    return false;
  }

  const correctionSteps = Math.floor(
    MAX_CORNER_CORRECTION / CORNER_CORRECTION_STEP
  );

  for (let step = 1; step <= correctionSteps; step++) {
    const correction =
      correctionDirection * step * CORNER_CORRECTION_STEP;
    const correctedX =
      directionX !== 0 ? player.position.x : player.position.x + correction;
    const correctedY =
      directionY !== 0 ? player.position.y : player.position.y + correction;
    const correctedNextX = correctedX + directionX * distance;
    const correctedNextY = correctedY + directionY * distance;

    // No se permite ni penetrar el obstáculo al alinearse ni
    // atravesarlo al avanzar después de la corrección.
    if (
      collidesWithObstacle(session, player.id, correctedX, correctedY) ||
      collidesWithObstacle(
        session,
        player.id,
        correctedNextX,
        correctedNextY
      )
    ) {
      continue;
    }

    player.position.x = correctedNextX;
    player.position.y = correctedNextY;
    return true;
  }

  return false;
}

function movePlayerByDelta(
  session: GameSession,
  player: GamePlayer,
  deltaSeconds: number
): void {
  const directionX =
    Number(player.movementInput.right) - Number(player.movementInput.left);

  const directionY =
    Number(player.movementInput.down) - Number(player.movementInput.up);

  // El servidor solo permite movimiento cardinal. Esta comprobación
  // también protege el motor si el estado se altera fuera del setter.
  if (
    (directionX !== 0 && directionY !== 0) ||
    (directionX === 0 && directionY === 0) ||
    player.speedTilesPerSecond <= 0
  ) {
    return;
  }

  const distance = player.speedTilesPerSecond * deltaSeconds;
  const steps = Math.max(1, Math.ceil(distance / MAX_SUBSTEP_DISTANCE));
  const stepDistance = distance / steps;

  for (let i = 0; i < steps; i++) {
    // Si ni el avance directo ni la pequeña corrección de esquina
    // son posibles, los subpasos restantes tampoco lo serán.
    if (
      !movePlayerStep(
        session,
        player,
        directionX,
        directionY,
        stepDistance
      )
    ) {
      break;
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
  if (!isActiveGame(session)) {
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
