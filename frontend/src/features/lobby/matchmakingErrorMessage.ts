import type { TranslationKey } from '@/locales/translations';

/**
 * Clave i18n para un `exception` emitido por el gateway de juego.
 *
 * Responsable:
 * - Traducir el fallo de `game:matchmaking` a una clave propia.
 *
 * No:
 * - Escuchar el socket (lo hace `LobbyPage`).
 * - Conocer el payload exacto: el backend lanza `WsException`
 *   con texto en inglés y sin código de error, así que se
 *   localiza el fragmento conocido en el payload serializado.
 */

/**
 * Fragmento de `Player <id> already has an active game`
 * (`matchmaking.service.ts`). Es el fallo previsible al reintentar
 * una partida que aún no ha terminado en el servidor.
 */
const ACTIVE_GAME_MARKER = 'already has an active game';

function serialize(payload: unknown): string {
  if (typeof payload === 'string') {
    return payload;
  }

  try {
    return JSON.stringify(payload) ?? '';
  } catch {
    return '';
  }
}

export function resolveMatchmakingErrorKey(payload: unknown): TranslationKey {
  return serialize(payload).includes(ACTIVE_GAME_MARKER)
    ? 'app.lobby.matchmakingActiveGame'
    : 'app.lobby.matchmakingFailed';
}
