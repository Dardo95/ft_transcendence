import { GAME_DEFAULTS } from '../config/game-defaults.js';
import type { GameSession, PowerUpState } from './game-state.js';

import { updatePlayerMovement } from './movement-system.js';

import { updateBombsAndExplosions } from './explosion-system.js';

import {
  collectPowerUps,
  spawnPowerUpsFromDestroyedWalls,
} from './powerup-system.js';

import { checkGameOutcome } from './victory-system.js';
import { updateOvertime } from './overtime-system.js';

import type { ExplosionUpdateResult } from './explosion-system.js';
import type { CollectedPowerUp } from './powerup-system.js';
import type { GameOutcomeUpdate } from './victory-system.js';
import type { OvertimeUpdateResult } from './overtime-system.js';

export interface GameTickResult {
  /** La cuenta atrás terminó en esta actualización. */
  started: boolean;

  /** Resultado de procesar bombas y explosiones. */
  explosions: ExplosionUpdateResult | null;

  /** Mejoras que aparecieron en este paso. */
  spawnedPowerUps: PowerUpState[];

  /** Mejoras recogidas en este paso. */
  collectedPowerUps: CollectedPowerUp[];

  /** Resultado de comprobar la victoria. */
  outcome: GameOutcomeUpdate | null;

  /** Transición a overtime y muros cerrados en este tick. */
  overtime: OvertimeUpdateResult | null;
}

function emptyTickResult(started = false): GameTickResult {
  return {
    started,
    explosions: null,
    spawnedPowerUps: [],
    collectedPowerUps: [],
    outcome: null,
    overtime: null,
  };
}

export class GameEngine {
  /**
   * Avanza una sesión exactamente un paso de simulación.
   *
   * deltaSeconds debe ser el paso fijo proporcionado
   * por GameLoop, no el tiempo medido por el navegador.
   */
  tick(
    session: GameSession,
    nowMs: number,
    deltaSeconds: number
  ): GameTickResult {
    if (!Number.isFinite(nowMs)) {
      throw new RangeError('nowMs must be finite');
    }

    if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) {
      throw new RangeError('deltaSeconds must be finite and positive');
    }

    if (session.status === 'FINISHED') {
      return emptyTickResult();
    }

    // 1. Gestionar la cuenta atrás.
    if (session.status === 'COUNTDOWN') {
      const startAtMs = session.createdAtMs + GAME_DEFAULTS.countdownMs;

      if (nowMs < startAtMs) {
        return emptyTickResult();
      }

      session.status = 'RUNNING';
      session.startedAtMs = startAtMs;

      // La primera actualización de gameplay se hará
      // en el siguiente paso fijo.
      return emptyTickResult(true);
    }

    if (session.status !== 'RUNNING' && session.status !== 'OVERTIME') {
      return emptyTickResult();
    }

    // 2. Movimiento continuo.
    updatePlayerMovement(session, deltaSeconds);

    // 3. Detonaciones, cadenas, destrucción y daño.
    const explosions = updateBombsAndExplosions(session, nowMs);

    // 4. Comprobar primero las bajas causadas por bombas. Si ya hay
    // un ganador o empate, el límite de tiempo no debe iniciar overtime.
    const outcomeBeforeOvertime = checkGameOutcome(session, nowMs);

    if (outcomeBeforeOvertime.finished) {
      return {
        started: false,
        explosions,
        spawnedPowerUps: [],
        collectedPowerUps: [],
        outcome: outcomeBeforeOvertime,
        overtime: null,
      };
    }

    // 5. El reloj del servidor inicia overtime al superar los 180 s
    // reglamentarios y va cerrando el tablero en espiral.
    const overtime = updateOvertime(session, nowMs);

    // Una pared puede eliminar a uno o varios jugadores. Comprobar de
    // nuevo el resultado solo cuando el overtime haya producido bajas.
    const overtimeOutcome =
      overtime.killedPlayerIds.length > 0
        ? checkGameOutcome(session, nowMs)
        : null;
    const outcome = overtimeOutcome ?? outcomeBeforeOvertime;

    if (outcome.finished) {
      return {
        started: false,
        explosions,
        spawnedPowerUps: [],
        collectedPowerUps: [],
        outcome,
        overtime,
      };
    }

    // 6. Generar las mejoras en los muros destruidos. El sistema comprueba
    // que la casilla siga siendo suelo (una pared de overtime no da drops).
    const spawnedPowerUps = spawnPowerUpsFromDestroyedWalls(
      session,
      explosions.destroyedWalls
    );

    // 7. Recoger mejoras con los jugadores vivos.
    const collectedPowerUps = collectPowerUps(session);

    return {
      started: false,
      explosions,
      spawnedPowerUps,
      collectedPowerUps,
      outcome,
      overtime,
    };
  }
}
