export const GAME_DEFAULTS = {
  // Simulación
  tickRateHz: 20,

  // Inicio y duración
  countdownMs: 3_000,
  matchDurationMs: 180_000,

  // Bombas y explosiones
  bombFuseMs: 2_500,
  explosionDurationMs: 500,

  // Estadísticas iniciales del jugador
  defaultBombCapacity: 1,
  defaultBlastRadius: 2,
  defaultSpeedTilesPerSecond: 4,

  // Límites de las mejoras
  maxBombCapacity: 5,
  maxBlastRadius: 8,
  maxSpeedTilesPerSecond: 7,
  speedPowerUpIncrement: 0.5,

  // Probabilidad de que un muro destruido revele
  // un power-up
  powerUpDropChance: 0.25,
} as const;
