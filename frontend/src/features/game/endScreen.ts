import type { GamePlayerSnapshot, GameSnapshot } from '@transcendence/shared';

/**
 * Pantalla que corresponde mostrar según el último snapshot:
 * - `victory`: la partida terminó y ganó el jugador local.
 * - `defeat`: la partida terminó con otro ganador (o sin ganador).
 * - `dead`: el local murió y la partida sigue sin él.
 * - `playing`: todo lo demás (demo, cuenta atrás, espectador
 *   sin identidad local).
 */
export type EndScreenState = 'playing' | 'dead' | 'victory' | 'defeat';

export function deriveEndScreen(
  snapshot: GameSnapshot,
  localId: string | null
): EndScreenState {
  // El fin de partida manda sobre la muerte: si el local ganó
  // estando "muerto" (o el backend no marcó `alive`), gana el
  // resultado.
  if (snapshot.status === 'FINISHED') {
    return localId !== null && snapshot.winnerId === localId
      ? 'victory'
      : 'defeat';
  }

  if (localId === null || snapshot.status === 'COUNTDOWN') {
    return 'playing';
  }

  const local = snapshot.players.find((player) => player.id === localId);

  // Solo durante la partida en curso: en fase de cuenta atrás
  // nadie ha podido morir.
  if (
    local &&
    !local.alive &&
    (snapshot.status === 'RUNNING' || snapshot.status === 'OVERTIME')
  ) {
    return 'dead';
  }

  return 'playing';
}

/**
 * Resultado de la demo local (GAME-F-13): la demo termina
 * cuando caen todos los bots (victoria) o muere el local
 * (muerte). La prioridad replica la del servidor: el resultado
 * manda sobre la muerte — si cayeron todos los bots, el local
 * gana aunque esté muerto.
 */
export function deriveDemoEndScreen(
  players: readonly GamePlayerSnapshot[],
  localId: string
): EndScreenState {
  const opponents = players.filter((player) => player.id !== localId);
  const local = players.find((player) => player.id === localId);

  if (opponents.length > 0 && opponents.every((player) => !player.alive)) {
    return 'victory';
  }

  if (local && !local.alive) {
    return 'dead';
  }

  return 'playing';
}
