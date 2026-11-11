/**
 * Lectores de los eventos de matchmaking del gateway de juego.
 *
 * Responsable:
 * - Validar los payloads de `game:matchmakingStatus`, `game:found`
 *   y `game:matchmakingCancelled` (llegan como `unknown`).
 * - Calcular los segundos restantes de un countdown del servidor.
 * - Construir la ruta de navegación a la partida.
 *
 * No:
 * - Escuchar el socket (lo hace `LobbyPage`).
 * - Mantener estado de UI.
 */

export type MatchmakingUpdate =
  | { type: 'searching' }
  | { type: 'countdown'; endsAt: number }
  | { type: 'cancelled' }
  | { type: 'created'; gameId: string };

function asRecord(payload: unknown): Record<string, unknown> | null {
  if (
    typeof payload !== 'object' ||
    payload === null ||
    Array.isArray(payload)
  ) {
    return null;
  }

  return payload as Record<string, unknown>;
}

function readGameId(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

/**
 * `game:matchmakingStatus` → actualización de UI.
 * Devuelve `null` si el payload no aporta nada (estado desconocido
 * o COUNTDOWN sin fecha fin válida).
 */
export function readMatchmakingStatus(
  payload: unknown
): MatchmakingUpdate | null {
  const data = asRecord(payload);

  if (!data) {
    return null;
  }

  if (data.status === 'CREATED') {
    const gameId = readGameId(data.gameId);
    return gameId ? { type: 'created', gameId } : null;
  }

  if (data.status === 'SEARCHING') {
    return { type: 'searching' };
  }

  if (data.status === 'CANCELLED') {
    return { type: 'cancelled' };
  }

  if (data.status === 'COUNTDOWN') {
    const endsAt = data.countdownEndsAt;

    if (typeof endsAt !== 'number' || !Number.isFinite(endsAt)) {
      return null;
    }

    return { type: 'countdown', endsAt };
  }

  return null;
}

/** `game:found` → id de la partida creada, o null si no vale. */
export function readGameFoundId(payload: unknown): string | null {
  const data = asRecord(payload);
  return data ? readGameId(data.gameId) : null;
}

/** `game:matchmakingCancelled` → si la cancelación fue efectiva. */
export function readCancelResult(payload: unknown): boolean {
  const data = asRecord(payload);
  return data?.cancelled === true;
}

/** Segundos restantes de un countdown del servidor (mínimo 0). */
export function countdownSeconds(endsAt: number, nowMs: number): number {
  return Math.max(0, Math.ceil((endsAt - nowMs) / 1000));
}

/** Ruta de la partida con el mapa elegido en el lobby. */
export function gameRoute(gameId: string, mapId: string): string {
  return `/game/${gameId}?map=${mapId}`;
}
