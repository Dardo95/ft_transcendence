import type { BombSnapshot, GamePlayerSnapshot } from '@transcendence/shared';

/** Estado visible que el tick compara sin reconstruir el modelo. */
export interface HudGateState {
  second: number;
  ownBombs: number;
  aliveCount: number;
  localId: string;
  localAlive: boolean;
  capacity: number;
  blast: number;
  speed: number;
}

export interface HudGateInputs {
  players: readonly GamePlayerSnapshot[];
  bombs: readonly BombSnapshot[];
  localId: string;
  elapsedMs: number;
}

/**
 * Devuelve el próximo estado del gate si algo visible cambió,
 * o `null` si el HUD no necesita repintarse.
 *
 * Comparar primitivos a 60 Hz es gratis; `buildHudModel` solo
 * se construye cuando cambia reloj, bombas propias, vivos o
 * stats del jugador local (regla de rendimiento de F-09).
 */
export function nextHudGate(
  prev: HudGateState,
  inputs: HudGateInputs
): HudGateState | null {
  const { players, bombs, localId, elapsedMs } = inputs;
  const second = Math.floor(elapsedMs / 1000);

  let ownBombs = 0;
  let aliveCount = 0;
  let localAlive = false;
  let capacity = 0;
  let blast = 0;
  let speed = 0;

  for (const player of players) {
    if (player.alive) {
      aliveCount++;
    }

    if (player.id === localId) {
      localAlive = player.alive;
      capacity = player.bombCapacity;
      blast = player.blastRadius;
      speed = player.speed;
    }
  }

  for (const bomb of bombs) {
    if (bomb.ownerId === localId) {
      ownBombs++;
    }
  }

  const changed =
    second !== prev.second ||
    ownBombs !== prev.ownBombs ||
    aliveCount !== prev.aliveCount ||
    localId !== prev.localId ||
    localAlive !== prev.localAlive ||
    capacity !== prev.capacity ||
    blast !== prev.blast ||
    speed !== prev.speed;

  if (!changed) {
    return null;
  }

  return {
    second,
    ownBombs,
    aliveCount,
    localId,
    localAlive,
    capacity,
    blast,
    speed,
  };
}
