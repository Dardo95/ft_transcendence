import type { GameSession } from './game-state.js';

export interface GameOutcomeUpdate {
  finished: boolean;
  newlyFinished: boolean;
  winnerId: string | null;
  isDraw: boolean;
  alivePlayerIds: string[];
}

function getAlivePlayerIds(session: GameSession): string[] {
  return [...session.players.values()]
    .filter((player) => player.alive)
    .map((player) => player.id)
    .sort();
}

/**
 * Comprueba si la partida ha terminado y actualiza
 * su estado cuando existe un ganador o un empate.
 *
 * nowMs debe proceder del reloj del servidor.
 */
export function checkGameOutcome(
  session: GameSession,
  nowMs: number
): GameOutcomeUpdate {
  if (!Number.isFinite(nowMs)) {
    throw new RangeError('nowMs must be finite');
  }

  const alivePlayerIds = getAlivePlayerIds(session);

  // Una partida finalizada nunca se modifica de nuevo.
  if (session.status === 'FINISHED') {
    return {
      finished: true,
      newlyFinished: false,
      winnerId: session.winnerId,
      isDraw: session.winnerId === null,
      alivePlayerIds,
    };
  }

  // No se puede ganar o empatar durante la cuenta atrás.
  if (session.status !== 'RUNNING' && session.status !== 'OVERTIME') {
    return {
      finished: false,
      newlyFinished: false,
      winnerId: null,
      isDraw: false,
      alivePlayerIds,
    };
  }

  // La partida continúa mientras haya más de un superviviente.
  if (alivePlayerIds.length > 1) {
    return {
      finished: false,
      newlyFinished: false,
      winnerId: null,
      isDraw: false,
      alivePlayerIds,
    };
  }

  const winnerId = alivePlayerIds.length === 1 ? alivePlayerIds[0] : null;

  session.status = 'FINISHED';
  session.finishedAtMs = nowMs;
  session.winnerId = winnerId;

  return {
    finished: true,
    newlyFinished: true,
    winnerId,
    isDraw: winnerId === null,
    alivePlayerIds,
  };
}
