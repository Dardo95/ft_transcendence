import { GAME_DEFAULTS } from '../config/game-defaults.js';
import type { GameSession } from './game-state.js';

import { monotonicNowMs } from './clock.js';
import { GameEngine, type GameTickResult } from './game-engine.js';

export interface GameLoopOptions {
  getSessions: () => Iterable<GameSession>;

  onTick?: (session: GameSession, result: GameTickResult) => void;

  onError?: (error: unknown, session: GameSession) => void;
}

const MAX_FRAME_TIME_MS = 250;
const MAX_CATCH_UP_STEPS = 5;

export class GameLoop {
  private readonly engine = new GameEngine();

  private readonly stepMs = 1000 / GAME_DEFAULTS.tickRateHz;

  private readonly options: GameLoopOptions;

  private timer: ReturnType<typeof setTimeout> | undefined;
  private running = false;

  private lastRealTimeMs = 0;
  private simulationTimeMs = 0;
  private accumulatorMs = 0;

  constructor(options: GameLoopOptions) {
    this.options = options;

    if (
      !Number.isFinite(GAME_DEFAULTS.tickRateHz) ||
      GAME_DEFAULTS.tickRateHz <= 0
    ) {
      throw new Error('tickRateHz must be positive');
    }
  }

  /**
   * Tiempo que utiliza la simulación.
   *
   * Al crear sesiones o colocar bombas desde otros servicios,
   * se debe utilizar este reloj cuando el bucle esté activo.
   */
  nowMs(): number {
    return this.running ? this.simulationTimeMs : monotonicNowMs();
  }

  start(): void {
    if (this.running) {
      return;
    }

    this.running = true;
    this.lastRealTimeMs = monotonicNowMs();
    this.simulationTimeMs = this.lastRealTimeMs;
    this.accumulatorMs = 0;

    this.scheduleNext();
  }

  stop(): void {
    this.running = false;

    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  isRunning(): boolean {
    return this.running;
  }

  private scheduleNext(): void {
    if (!this.running) {
      return;
    }

    const delayMs = Math.max(0, this.stepMs - this.accumulatorMs);

    this.timer = setTimeout(() => this.runFrame(), delayMs);
  }

  private runFrame(): void {
    if (!this.running) {
      return;
    }

    const realNowMs = monotonicNowMs();

    const elapsedMs = Math.max(
      0,
      Math.min(realNowMs - this.lastRealTimeMs, MAX_FRAME_TIME_MS)
    );

    this.lastRealTimeMs = realNowMs;
    this.accumulatorMs += elapsedMs;

    let steps = 0;

    while (this.accumulatorMs >= this.stepMs && steps < MAX_CATCH_UP_STEPS) {
      this.simulationTimeMs += this.stepMs;

      const nowMs = this.simulationTimeMs;
      const deltaSeconds = this.stepMs / 1000;

      // Copia la colección para evitar problemas si una
      // sesión se añade o retira mientras se procesa.
      const sessions = [...this.options.getSessions()];

      for (const session of sessions) {
        if (session.status === 'FINISHED') {
          continue;
        }

        let result: GameTickResult;

        try {
          result = this.engine.tick(session, nowMs, deltaSeconds);
        } catch (error) {
          this.reportError(error, session);
          continue;
        }

        try {
          this.options.onTick?.(session, result);
        } catch (error) {
          this.reportError(error, session);
        }
      }

      this.accumulatorMs -= this.stepMs;
      steps++;
    }

    // Evitar una espiral de actualizaciones atrasadas si el
    // servidor se bloquea durante demasiado tiempo.
    if (steps === MAX_CATCH_UP_STEPS && this.accumulatorMs >= this.stepMs) {
      this.accumulatorMs %= this.stepMs;
    }

    this.scheduleNext();
  }

  private reportError(error: unknown, session: GameSession): void {
    if (this.options.onError) {
      this.options.onError(error, session);
      return;
    }

    console.error(`Error updating game session ${session.id}:`, error);
  }
}
