import type { MovementInput } from '@transcendence/shared';

import { TileType } from '../map/types';

export const STOPPED_MOVEMENT: MovementInput = {
  up: false,
  down: false,
  left: false,
  right: false,
};

const DIRECTIONS: readonly MovementInput[] = [
  { up: true, down: false, left: false, right: false },
  { up: false, down: true, left: false, right: false },
  { up: false, down: false, left: true, right: false },
  { up: false, down: false, left: false, right: true },
];

// Cadencia de cambio de dirección (con jitter): evita que el
// bot quede girando en el mismo sitio.
const DIRECTION_MIN_MS = 700;
const DIRECTION_JITTER_MS = 1200;
// Enfriamiento entre bombas del mismo bot.
const BOMB_COOLDOWN_MS = 4000;

/** Estado por bot entre ticks (inmutable: nunca se muta). */
export interface BotBrainState {
  direction: MovementInput;
  directionUntilMs: number;
  nextBombAtMs: number;
}

export interface BotBrainInputs {
  nowMs: number;
  map: readonly number[][];
  position: { x: number; y: number };
  alive: boolean;
  /** Pidió moverse en el tick anterior y no avanzó (muro). */
  blocked: boolean;
  /** RNG inyectado: en producción `Math.random`, en tests una secuencia. */
  rng: () => number;
}

export interface BotDecision {
  movement: MovementInput;
  placeBomb: boolean;
}

export interface BotBrainResult {
  state: BotBrainState;
  decision: BotDecision;
}

/** Estado inicial: sin dirección y sin enfriamiento de bomba. */
export function initialBotBrainState(): BotBrainState {
  return { direction: STOPPED_MOVEMENT, directionUntilMs: 0, nextBombAtMs: 0 };
}

export function isMoving(movement: MovementInput): boolean {
  return movement.up || movement.down || movement.left || movement.right;
}

function pickDirection(
  current: MovementInput,
  rng: () => number
): MovementInput {
  // Al chocar, cualquier dirección salvo la actual (que daba
  // contra el muro); con dirección inicial (STOPPED), las4.
  const candidates = DIRECTIONS.filter((d) => d !== current);
  const pool = candidates.length > 0 ? candidates : DIRECTIONS;
  return pool[Math.floor(rng() * pool.length) % pool.length];
}

/** true si el bot está junto a un muro, bloque o fuera del mapa. */
function adjacentToWall(
  map: readonly number[][],
  position: { x: number; y: number }
): boolean {
  const tileX = Math.floor(position.x);
  const tileY = Math.floor(position.y);

  // Fuera del mapa cuenta como muro (misma regla que la
  // colisión del piloto).
  return (
    map[tileY]?.[tileX + 1] !== TileType.FLOOR ||
    map[tileY]?.[tileX - 1] !== TileType.FLOOR ||
    map[tileY + 1]?.[tileX] !== TileType.FLOOR ||
    map[tileY - 1]?.[tileX] !== TileType.FLOOR
  );
}

/**
 * Comportamiento del bot de la demo (GAME-F-13): deambula
 * cambiando de dirección al chocar o al vencer el temporizador,
 * y suelta bomba junto a un muro cuando su enfriamiento lo
 * permite. Sin huir de explosiones: los bots mueren fácil.
 *
 * Función pura: recibe el estado anterior y devuelve el próximo
 * estado + la decisión; nunca muta la entrada.
 */
export function nextBotDecision(
  state: BotBrainState,
  inputs: BotBrainInputs
): BotBrainResult {
  const { nowMs, map, position, alive, blocked, rng } = inputs;

  if (!alive) {
    return {
      state,
      decision: { movement: STOPPED_MOVEMENT, placeBomb: false },
    };
  }

  let { direction, directionUntilMs, nextBombAtMs } = state;

  if (blocked || nowMs >= directionUntilMs) {
    direction = pickDirection(direction, rng);
    directionUntilMs =
      nowMs + DIRECTION_MIN_MS + Math.floor(rng() * DIRECTION_JITTER_MS);
  }

  const placeBomb = nowMs >= nextBombAtMs && adjacentToWall(map, position);

  if (placeBomb) {
    nextBombAtMs = nowMs + BOMB_COOLDOWN_MS;
  }

  return {
    state: { direction, directionUntilMs, nextBombAtMs },
    decision: { movement: direction, placeBomb },
  };
}
