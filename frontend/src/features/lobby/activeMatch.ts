/**
 * Active match detection for the lobby.
 *
 * Responsible for:
 * - Reading the active `gameId` from the backend response.
 * - Fetching the current user's active match.
 *
 * Does not:
 * - Listen to sockets (LobbyPage owns the listeners).
 * - Keep UI state.
 */

import { apiFetch } from '@/api/api';

export interface ActiveGameResponse {
  gameId: string | null;
}

/** `{ gameId }` → id, or `null` when absent/invalid. */
export function readActiveGameId(payload: unknown): string | null {
  if (typeof payload !== 'object' || payload === null) {
    return null;
  }

  const gameId = (payload as { gameId?: unknown }).gameId;

  return typeof gameId === 'string' && gameId.trim() ? gameId : null;
}

/**
 * Returns the authenticated user's active match id, including practice and
 * private matches. Failures are treated as "no active match" so the lobby
 * never becomes unusable because of a transient backend error.
 */
export async function fetchActiveGameId(): Promise<string | null> {
  try {
    const response = await apiFetch<ActiveGameResponse>('/game/active');
    return readActiveGameId(response);
  } catch {
    return null;
  }
}
