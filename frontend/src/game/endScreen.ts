import type { GameSnapshot } from '@transcendence/shared';

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
