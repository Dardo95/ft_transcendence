import type { Position } from '@transcendence/shared';

import { GAME_DEFAULTS } from '../config/game-defaults.js';
import { destroyDestructibleWallAt, getTerrainAt } from './game-board.js';
import { overlapsTile } from './collision-geometry.js';
import type {
  ActiveExplosionState,
  BombState,
  GameSession,
} from './game-state.js';

export interface ExplosionUpdateResult {
  detonatedBombIds: string[];
  destroyedWalls: Position[];
  killedPlayerIds: string[];
}

const DIRECTIONS = [
  { dx: 0, dy: -1 }, // Arriba
  { dx: 0, dy: 1 }, // Abajo
  { dx: -1, dy: 0 }, // Izquierda
  { dx: 1, dy: 0 }, // Derecha
] as const;

function tileKey(position: Position): string {
  return `${position.x},${position.y}`;
}

function findBombAt(
  session: GameSession,
  x: number,
  y: number
): BombState | undefined {
  for (const bomb of session.bombs.values()) {
    if (bomb.position.x === x && bomb.position.y === y) {
      return bomb;
    }
  }

  return undefined;
}

function calculateExplosionCells(
  session: GameSession,
  bomb: BombState,
  pendingBombIds: string[],
  queuedBombIds: Set<string>,
  destroyedWalls: Map<string, Position>
): Position[] {
  const cells = new Map<string, Position>();

  const addCell = (x: number, y: number): void => {
    const position = { x, y };
    cells.set(tileKey(position), position);
  };

  // La casilla donde estaba colocada la bomba siempre
  // forma parte de la explosión.
  addCell(bomb.position.x, bomb.position.y);

  for (const direction of DIRECTIONS) {
    for (let distance = 1; distance <= bomb.blastRadius; distance++) {
      const x = bomb.position.x + direction.dx * distance;
      const y = bomb.position.y + direction.dy * distance;

      const terrain = getTerrainAt(session.board, x, y);

      // Los límites del tablero y los muros
      // indestructibles detienen el rayo.
      if (terrain === null || terrain === 'INDESTRUCTIBLE') {
        break;
      }

      // El fuego alcanza la casilla del muro
      // destructible, pero no continúa detrás.
      addCell(x, y);

      if (terrain === 'DESTRUCTIBLE') {
        const position = { x, y };
        destroyedWalls.set(tileKey(position), position);
        break;
      }

      // Si el fuego alcanza una bomba situada en suelo,
      // la bomba se añade a la cola de detonaciones.
      const chainedBomb = findBombAt(session, x, y);

      if (chainedBomb && !queuedBombIds.has(chainedBomb.id)) {
        queuedBombIds.add(chainedBomb.id);
        pendingBombIds.push(chainedBomb.id);
      }
    }
  }

  return [...cells.values()];
}

function removeExpiredExplosions(session: GameSession, nowMs: number): void {
  for (const [id, explosion] of session.explosions) {
    if (explosion.expiresAtMs <= nowMs) {
      session.explosions.delete(id);
    }
  }
}

function applyExplosionDamage(session: GameSession): string[] {
  const killedPlayerIds: string[] = [];

  for (const player of session.players.values()) {
    if (!player.alive) {
      continue;
    }

    for (const explosion of session.explosions.values()) {
      const hit = explosion.cells.some((cell) =>
        overlapsTile(player.position, cell)
      );

      if (hit) {
        player.alive = false;
        killedPlayerIds.push(player.id);
        break;
      }
    }
  }

  return killedPlayerIds;
}

/**
 * Actualiza las bombas y las explosiones.
 *
 * nowMs debe proceder del reloj del servidor.
 * Puede llamarse en cada actualización de la simulación.
 */
export function updateBombsAndExplosions(
  session: GameSession,
  nowMs: number
): ExplosionUpdateResult {
  if (!Number.isFinite(nowMs)) {
    throw new RangeError('nowMs must be finite');
  }

  removeExpiredExplosions(session, nowMs);

  if (session.status !== 'RUNNING' && session.status !== 'OVERTIME') {
    return {
      detonatedBombIds: [],
      destroyedWalls: [],
      killedPlayerIds: [],
    };
  }

  // Las bombas que ya deben explotar se procesan
  // en un orden determinista.
  const pendingBombIds = [...session.bombs.values()]
    .filter((bomb) => bomb.detonateAtMs <= nowMs)
    .sort((a, b) => a.detonateAtMs - b.detonateAtMs || a.id.localeCompare(b.id))
    .map((bomb) => bomb.id);

  const queuedBombIds = new Set(pendingBombIds);
  const detonatedBombIds: string[] = [];
  const destroyedWallMap = new Map<string, Position>();

  const newExplosions: ActiveExplosionState[] = [];

  // Se calculan todas las explosiones de la cadena
  // antes de modificar el terreno.
  for (let index = 0; index < pendingBombIds.length; index++) {
    const bombId = pendingBombIds[index];
    const bomb = session.bombs.get(bombId);

    // Puede no existir si la sesión se ha modificado
    // externamente mientras se procesaba.
    if (!bomb) {
      continue;
    }

    detonatedBombIds.push(bomb.id);

    const cells = calculateExplosionCells(
      session,
      bomb,
      pendingBombIds,
      queuedBombIds,
      destroyedWallMap
    );

    newExplosions.push({
      id: `${bomb.id}:explosion:${nowMs}:${newExplosions.length}`,
      cells,
      expiresAtMs: nowMs + GAME_DEFAULTS.explosionDurationMs,
    });
  }

  // Destruimos los muros únicamente después de calcular
  // todos los rayos de esta cadena.
  const destroyedWalls: Position[] = [];

  for (const position of destroyedWallMap.values()) {
    if (destroyDestructibleWallAt(session.board, position.x, position.y)) {
      destroyedWalls.push({ ...position });
    }
  }

  // Retiramos las bombas detonadas y devolvemos
  // capacidad a sus propietarios.
  for (const bombId of detonatedBombIds) {
    const bomb = session.bombs.get(bombId);

    if (!bomb) {
      continue;
    }

    session.bombs.delete(bombId);
    session.players.get(bomb.ownerId)?.activeBombIds.delete(bombId);
  }

  // Las llamas permanecen activas durante el intervalo
  // configurado, incluso después de retirar las bombas.
  for (const explosion of newExplosions) {
    session.explosions.set(explosion.id, explosion);
  }

  // También se comprueban las llamas de actualizaciones
  // anteriores para matar a quien entre en ellas.
  const killedPlayerIds = applyExplosionDamage(session);

  return {
    detonatedBombIds,
    destroyedWalls,
    killedPlayerIds,
  };
}
