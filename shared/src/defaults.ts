/**
 * Constantes de configuración de partida, fuente única para el
 * backend (motor) y el frontend (lobby, HUD). El backend las
 * re-exporta desde `backend/src/game/config/game-defaults.ts`
 * para no romper sus imports existentes.
 */
export const GAME_DEFAULTS = {
  // Simulación
  tickRateHz: 20,

  // Inicio y duración
  countdownMs: 3_000,
  matchDurationMs: 150_000,

  // Overtime: first tile closes after a short warning, then one tile per interval.
  overtimeFirstWallDelayMs: 1_000,
  overtimeWallIntervalMs: 250,

  // Bombas y explosiones
  bombFuseMs: 2_500,
  explosionDurationMs: 500,

  // Estadísticas iniciales del jugador
  defaultBombCapacity: 1,
  defaultBlastRadius: 1,
  defaultSpeedTilesPerSecond: 4,

  // Límites de las mejoras
  maxBombCapacity: 5,
  maxBlastRadius: 8,
  maxSpeedTilesPerSecond: 7,
  speedPowerUpIncrement: 0.5,

  // Probabilidad de que un muro destruido revele
  // un power-up
  powerUpDropChance: 0.3,
} as const;
