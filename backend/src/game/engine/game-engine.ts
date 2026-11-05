import { GAME_DEFAULTS } from '../config/game-defaults.js';
import type { GameSession, PowerUpState } from './game-state.js';

import { updatePlayerMovement } from './movement-system.js';

import { updateBombsAndExplosions } from './explosion-system.js';

import {
  collectPowerUps,
  spawnPowerUpsFromDestroyedWalls,
} from './powerup-system.js';

import { checkGameOutcome } from './victory-system.js';

import type { ExplosionUpdateResult } from './explosion-system.js';
import type { CollectedPowerUp } from './powerup-system.js';
import type { GameOutcomeUpdate } from './victory-system.js';

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
}

function emptyTickResult(started = false): GameTickResult {
  return {
    started,
    explosions: null,
    spawnedPowerUps: [],
    collectedPowerUps: [],
    outcome: null,
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

    // 4. Comprobar inmediatamente si el daño terminó
    // la partida. Así no aparecen ni se recogen mejoras
    // después de que la partida haya concluido.
    const outcome = checkGameOutcome(session, nowMs);

    if (outcome.finished) {
      return {
        started: false,
        explosions,
        spawnedPowerUps: [],
        collectedPowerUps: [],
        outcome,
      };
    }

    // 5. Generar las mejoras en los muros destruidos.
    const spawnedPowerUps = spawnPowerUpsFromDestroyedWalls(
      session,
      explosions.destroyedWalls
    );

    // 6. Recoger mejoras con los jugadores vivos.
    const collectedPowerUps = collectPowerUps(session);

    return {
      started: false,
      explosions,
      spawnedPowerUps,
      collectedPowerUps,
      outcome,
    };
  }
}
