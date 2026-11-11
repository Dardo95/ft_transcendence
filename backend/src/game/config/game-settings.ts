import { WsException } from '@nestjs/websockets';

import type { GameSettings } from '@transcendence/shared';

import { GAME_DEFAULTS } from './game-defaults.js';

/**
 * Valores que usa el lobby cuando el jugador no envía ajustes.
 * Coinciden con los valores iniciales del frontend.
 */
export const DEFAULT_GAME_SETTINGS: GameSettings = {
  initialBombs: GAME_DEFAULTS.defaultBombCapacity,
  initialSpeed: 1,
  fuseTime: 3,
};

export const GAME_SETTINGS_LIMITS = {
  initialBombs: { min: 1, max: 3 },
  initialSpeed: { min: 1, max: 3 },
  fuseTime: { min: 2, max: 5 },
} as const;

/**
 * Ajustes ya traducidos a las unidades que usa el motor.
 */
export interface ResolvedGameSettings {
  bombCapacity: number;
  speedTilesPerSecond: number;
  bombFuseMs: number;
}

function readInteger(
  value: unknown,
  name: keyof typeof GAME_SETTINGS_LIMITS,
  fallback: number
): number {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new WsException(`Setting "${name}" must be an integer`);
  }

  const { min, max } = GAME_SETTINGS_LIMITS[name];

  if (value < min || value > max) {
    throw new WsException(
      `Setting "${name}" must be between ${min} and ${max}`
    );
  }

  return value;
}

/**
 * Valida y normaliza los ajustes recibidos del cliente.
 * Los campos ausentes toman el valor por defecto.
 */
export function normalizeGameSettings(settings: unknown): GameSettings {
  if (settings === undefined || settings === null) {
    return { ...DEFAULT_GAME_SETTINGS };
  }

  if (typeof settings !== 'object' || Array.isArray(settings)) {
    throw new WsException('Invalid matchmaking settings');
  }

  const value = settings as Record<string, unknown>;

  return {
    initialBombs: readInteger(
      value.initialBombs,
      'initialBombs',
      DEFAULT_GAME_SETTINGS.initialBombs
    ),
    initialSpeed: readInteger(
      value.initialSpeed,
      'initialSpeed',
      DEFAULT_GAME_SETTINGS.initialSpeed
    ),
    fuseTime: readInteger(
      value.fuseTime,
      'fuseTime',
      DEFAULT_GAME_SETTINGS.fuseTime
    ),
  };
}

/**
 * Convierte los ajustes públicos a valores del motor.
 *
 * - Cada nivel de velocidad parte de la velocidad por defecto.
 * - La mecha se expresa en segundos en el lobby y en milisegundos en el motor.
 *
 * Sin ajustes explícitos se conservan los valores base del backend.
 */
export function resolveGameSettings(
  settings?: GameSettings
): ResolvedGameSettings {
  if (!settings) {
    return {
      bombCapacity: GAME_DEFAULTS.defaultBombCapacity,
      speedTilesPerSecond: GAME_DEFAULTS.defaultSpeedTilesPerSecond,
      bombFuseMs: GAME_DEFAULTS.bombFuseMs,
    };
  }

  return {
    bombCapacity: Math.min(
      GAME_DEFAULTS.maxBombCapacity,
      Math.max(1, settings.initialBombs)
    ),
    speedTilesPerSecond: Math.min(
      GAME_DEFAULTS.maxSpeedTilesPerSecond,
      GAME_DEFAULTS.defaultSpeedTilesPerSecond + (settings.initialSpeed - 1)
    ),
    bombFuseMs: Math.round(settings.fuseTime * 1000),
  };
}
