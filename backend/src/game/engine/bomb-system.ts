import type { Position } from '@transcendence/shared';

import { GAME_DEFAULTS } from '../config/game-defaults.js';
import { getTerrainAt } from './game-board.js';
import { overlapsTile } from './collision-geometry.js';
import type { BombState, GameSession } from './game-state.js';

import { monotonicNowMs } from './clock.js';

type PlaceBombFailureReason =
  | 'PLAYER_NOT_FOUND'
  | 'PLAYER_DEAD'
  | 'GAME_NOT_RUNNING'
  | 'BOT_CONTROLLED'
  | 'INVALID_BOMB_ID'
  | 'INVALID_TIME'
  | 'BLOCKED_TERRAIN'
  | 'BOMB_ALREADY_PRESENT'
  | 'BOMB_CAPACITY_REACHED';

export type PlaceBombResult =
  | {
      success: true;
      bombId: string;
      position: Position;
      detonateAtMs: number;
    }
  | {
      success: false;
      reason: PlaceBombFailureReason;
    };

/**
 * Coloca una bomba en la casilla que ocupa el jugador.
 *
 * El llamador proporciona un ID único para la bomba.
 * nowMs debe proceder del reloj del servidor.
 *
 * No programa la detonación todavía: eso se implementará
 * en el sistema de simulación.
 */
export function placeBomb(
  session: GameSession,
  playerId: string,
  bombId: string,
  nowMs: number = monotonicNowMs()
): PlaceBombResult {
  const player = session.players.get(playerId);

  if (!player) {
    return { success: false, reason: 'PLAYER_NOT_FOUND' };
  }

  if (!player.alive) {
    return { success: false, reason: 'PLAYER_DEAD' };
  }

  if (session.status !== 'RUNNING') {
    return { success: false, reason: 'GAME_NOT_RUNNING' };
  }

  // El bot permanece quieto y no realiza acciones.
  if (player.isBot) {
    return { success: false, reason: 'BOT_CONTROLLED' };
  }

  if (!bombId.trim() || session.bombs.has(bombId)) {
    return { success: false, reason: 'INVALID_BOMB_ID' };
  }

  if (!Number.isFinite(nowMs)) {
    return { success: false, reason: 'INVALID_TIME' };
  }

  // Las bombas siempre ocupan una casilla entera,
  // aunque el jugador se desplace con coordenadas decimales.
  const tilePosition: Position = {
    x: Math.floor(player.position.x),
    y: Math.floor(player.position.y),
  };

  if (getTerrainAt(session.board, tilePosition.x, tilePosition.y) !== 'FLOOR') {
    return { success: false, reason: 'BLOCKED_TERRAIN' };
  }

  const occupied = [...session.bombs.values()].some(
    (bomb) =>
      bomb.position.x === tilePosition.x && bomb.position.y === tilePosition.y
  );

  if (occupied) {
    return {
      success: false,
      reason: 'BOMB_ALREADY_PRESENT',
    };
  }

  if (player.activeBombIds.size >= player.bombCapacity) {
    return {
      success: false,
      reason: 'BOMB_CAPACITY_REACHED',
    };
  }

  // Permitir que quienes ya estaban dentro de la casilla
  // puedan salir, pero no volver a entrar después.
  const passThroughPlayerIds = new Set<string>();

  for (const candidate of session.players.values()) {
    if (candidate.alive && overlapsTile(candidate.position, tilePosition)) {
      passThroughPlayerIds.add(candidate.id);
    }
  }

  // El propietario debe poder salir siempre.
  passThroughPlayerIds.add(player.id);

  const bomb: BombState = {
    id: bombId,
    ownerId: playerId,
    position: tilePosition,

    placedAtMs: nowMs,
    detonateAtMs: nowMs + GAME_DEFAULTS.bombFuseMs,

    // El alcance queda fijado al colocar la bomba.
    blastRadius: player.blastRadius,

    passThroughPlayerIds,
  };

  session.bombs.set(bomb.id, bomb);
  player.activeBombIds.add(bomb.id);

  return {
    success: true,
    bombId: bomb.id,
    position: { ...bomb.position },
    detonateAtMs: bomb.detonateAtMs,
  };
}
