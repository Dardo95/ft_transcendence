import type { Position } from '@transcendence/shared';

import { GAME_DEFAULTS } from '../config/game-defaults.js';
import { overlapsTile } from './collision-geometry.js';
import { getTerrainAt } from './game-board.js';
import type { GameSession, OvertimeState } from './game-state.js';

const STOPPED_MOVEMENT = {
  up: false,
  down: false,
  left: false,
  right: false,
} as const;

export type OvertimeStartCorner =
  'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';

const OVERTIME_START_CORNERS: OvertimeStartCorner[] = [
  'top-left',
  'top-right',
  'bottom-right',
  'bottom-left',
];

export interface OvertimeUpdateResult {
  /** True only on the tick that changes RUNNING to OVERTIME. */
  started: boolean;
  /** Tiles converted into indestructible walls during this update. */
  closedTiles: Position[];
  /** Players eliminated because a wall closed on their hitbox. */
  killedPlayerIds: string[];
}

function emptyResult(started = false): OvertimeUpdateResult {
  return { started, closedTiles: [], killedPlayerIds: [] };
}

function getRing(
  left: number,
  right: number,
  top: number,
  bottom: number
): Position[] {
  const ring: Position[] = [];

  for (let x = left; x <= right; x++) {
    ring.push({ x, y: top });
  }

  for (let y = top + 1; y <= bottom; y++) {
    ring.push({ x: right, y });
  }

  if (top < bottom) {
    for (let x = right - 1; x >= left; x--) {
      ring.push({ x, y: bottom });
    }
  }

  if (left < right) {
    for (let y = bottom - 1; y > top; y--) {
      ring.push({ x: left, y });
    }
  }

  return ring;
}

/**
 * Returns the playable cells in a clockwise spiral, starting at the
 * requested inner corner and ending at the centre. The outer map border
 * is excluded because it is already indestructible.
 */
export function createOvertimeSpiral(
  width: number,
  height: number,
  startCorner: OvertimeStartCorner = 'top-left'
): Position[] {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 3 ||
    height < 3
  ) {
    return [];
  }

  const positions: Position[] = [];
  let left = 1;
  let right = width - 2;
  let top = 1;
  let bottom = height - 2;

  while (left <= right && top <= bottom) {
    const ring = getRing(left, right, top, bottom);
    const startPosition: Position = {
      x: startCorner.endsWith('right') ? right : left,
      y: startCorner.startsWith('bottom') ? bottom : top,
    };
    const startIndex = ring.findIndex(
      (position) =>
        position.x === startPosition.x && position.y === startPosition.y
    );

    const offset = Math.max(0, startIndex);
    for (let index = 0; index < ring.length; index++) {
      positions.push(ring[(offset + index) % ring.length]);
    }

    left++;
    right--;
    top++;
    bottom--;
  }

  return positions;
}

function getSessionStartCorner(sessionId: string): OvertimeStartCorner {
  // FNV-1a: orientación estable por partida, sin depender de Math.random.
  let hash = 0x811c9dc5;

  for (let index = 0; index < sessionId.length; index++) {
    hash ^= sessionId.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return OVERTIME_START_CORNERS[(hash >>> 0) % OVERTIME_START_CORNERS.length];
}

function createOvertimeState(
  session: GameSession,
  startedAtMs: number
): OvertimeState {
  const tileOrder = createOvertimeSpiral(
    session.board.width,
    session.board.height,
    getSessionStartCorner(session.id)
  )
    // Existing indestructible tiles already form part of the closing barrier.
    .filter(
      (position) =>
        getTerrainAt(session.board, position.x, position.y) !== 'INDESTRUCTIBLE'
    );

  return {
    startedAtMs,
    tileOrder,
    nextTileIndex: 0,
  };
}

function closeTile(session: GameSession, position: Position): string[] {
  const { x, y } = position;
  const terrain = getTerrainAt(session.board, x, y);

  if (terrain === null || terrain === 'INDESTRUCTIBLE') {
    return [];
  }

  // Closing walls are authoritative terrain, not destructible blocks.
  session.board.tiles[y][x] = 'INDESTRUCTIBLE';

  // A wall consumes bombs and power-ups on its tile.
  for (const [bombId, bomb] of session.bombs) {
    if (bomb.position.x === x && bomb.position.y === y) {
      session.bombs.delete(bombId);
      session.players.get(bomb.ownerId)?.activeBombIds.delete(bombId);
    }
  }

  for (const [powerUpId, powerUp] of session.powerUps) {
    if (powerUp.position.x === x && powerUp.position.y === y) {
      session.powerUps.delete(powerUpId);
    }
  }

  // The newly closed wall also extinguishes any flame on its tile.
  for (const [explosionId, explosion] of session.explosions) {
    explosion.cells = explosion.cells.filter(
      (cell) => cell.x !== x || cell.y !== y
    );

    if (explosion.cells.length === 0) {
      session.explosions.delete(explosionId);
    }
  }

  const killedPlayerIds: string[] = [];

  for (const player of session.players.values()) {
    if (player.alive && overlapsTile(player.position, position)) {
      player.alive = false;
      player.movementInput = { ...STOPPED_MOVEMENT };
      killedPlayerIds.push(player.id);
    }
  }

  return killedPlayerIds;
}

/**
 * Starts overtime when the authoritative match duration expires and closes
 * one interior tile after the warning delay, then one tile per interval.
 * If a tick is late, all tiles already due are processed in order.
 */
export function updateOvertime(
  session: GameSession,
  nowMs: number
): OvertimeUpdateResult {
  if (!Number.isFinite(nowMs)) {
    throw new RangeError('nowMs must be finite');
  }

  let started = false;

  if (
    session.status === 'RUNNING' &&
    session.startedAtMs !== null &&
    nowMs >= session.startedAtMs + GAME_DEFAULTS.matchDurationMs
  ) {
    const overtimeStartedAtMs =
      session.startedAtMs + GAME_DEFAULTS.matchDurationMs;

    session.status = 'OVERTIME';
    session.overtime = createOvertimeState(session, overtimeStartedAtMs);
    started = true;
  }

  if (session.status !== 'OVERTIME' || session.overtime === null) {
    return emptyResult(started);
  }

  const overtime = session.overtime;
  const closedTiles: Position[] = [];
  const killedPlayerIds: string[] = [];

  while (overtime.nextTileIndex < overtime.tileOrder.length) {
    const dueAtMs =
      overtime.startedAtMs +
      GAME_DEFAULTS.overtimeFirstWallDelayMs +
      overtime.nextTileIndex * GAME_DEFAULTS.overtimeWallIntervalMs;

    if (nowMs < dueAtMs) {
      break;
    }

    const position = overtime.tileOrder[overtime.nextTileIndex];
    overtime.nextTileIndex++;

    const terrainBeforeClose = getTerrainAt(
      session.board,
      position.x,
      position.y
    );
    const killed = closeTile(session, position);

    if (
      terrainBeforeClose !== null &&
      terrainBeforeClose !== 'INDESTRUCTIBLE'
    ) {
      closedTiles.push({ ...position });
    }

    killedPlayerIds.push(...killed);
  }

  return { started, closedTiles, killedPlayerIds };
}
