import type { TranslationKey } from '@/locales/translations';

/**
 * Translation key for an `exception` emitted by the game gateway.
 *
 * Responsible for:
 * - Turning a failed `game:matchmaking` request into its own localized key.
 *
 * Does not:
 * - Listen to the socket (it is handled by `LobbyPage`).
 * - Know the exact payload shape: the backend throws `WsException` with
 *   plain English text and no error code, so the known fragment is matched
 *   against the serialized payload.
 */

interface MatchmakingErrorRule {
  marker: string;
  key: TranslationKey;
}

const MATCHMAKING_ERROR_RULES: MatchmakingErrorRule[] = [
  {
    marker: 'already has an active game',
    key: 'app.lobby.matchmakingActiveGame',
  },
  {
    marker: 'between 2 and 4 players',
    key: 'app.lobby.matchmakingPrivatePlayers',
  },
  {
    marker: 'already searching on a different map',
    key: 'app.lobby.matchmakingDifferentMap',
  },
  {
    marker: 'only the lobby host can start a private match',
    key: 'app.lobby.matchmakingHostOnly',
  },
  {
    marker: 'not in a lobby',
    key: 'app.lobby.matchmakingNotInLobby',
  },
];

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
  const serialized = serialize(payload).toLowerCase();
  const rule = MATCHMAKING_ERROR_RULES.find(({ marker }) =>
    serialized.includes(marker)
  );

  return rule?.key ?? 'app.lobby.matchmakingFailed';
}
