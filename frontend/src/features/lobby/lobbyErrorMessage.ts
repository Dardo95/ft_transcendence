import type { TranslationKey } from '@/locales/translations';

/**
 * Maps raw `lobby:error` messages emitted by the chat gateway to localized keys.
 *
 * Responsible for:
 * - Turning the backend's English error strings into keys under `app.lobby.*`.
 * - Detecting stale-lobby failures that require a `lobby:sync`.
 *
 * Does not:
 * - Listen to the socket (the lobby store owns that).
 * - Render UI.
 */

interface LobbyErrorRule {
  marker: string;
  key: TranslationKey;
}

/**
 * Order matters: the first matching marker wins. Markers are kept lowercase
 * because the backend messages are compared case-insensitively.
 */
const LOBBY_ERROR_RULES: LobbyErrorRule[] = [
  {
    marker: 'username is required',
    key: 'app.lobby.lobbyErrorUsernameRequired',
  },
  { marker: 'user not found', key: 'app.lobby.lobbyErrorUserNotFound' },
  {
    marker: 'only invite accepted friends',
    key: 'app.lobby.lobbyErrorNotFriends',
  },
  {
    marker: 'only the host can invite',
    key: 'app.lobby.lobbyErrorOnlyHostCanInvite',
  },
  {
    marker: 'cannot invite yourself',
    key: 'app.lobby.lobbyErrorCannotInviteSelf',
  },
  {
    marker: 'already in a lobby with other members',
    key: 'app.lobby.lobbyErrorInviteeInGroup',
  },
  { marker: 'lobby is full', key: 'app.lobby.lobbyErrorLobbyFull' },
  {
    marker: 'invitation already exists',
    key: 'app.lobby.lobbyErrorInvitationExists',
  },
  {
    marker: 'invitation not found',
    key: 'app.lobby.lobbyErrorInvitationNotFound',
  },
  {
    marker: 'lobby no longer exists',
    key: 'app.lobby.lobbyErrorLobbyGone',
  },
  {
    marker: 'you are not in a lobby',
    key: 'app.lobby.lobbyErrorNotInLobby',
  },
  {
    marker: 'you are already in a lobby',
    key: 'app.lobby.lobbyErrorAlreadyInLobby',
  },
  {
    marker: 'invitation id is required',
    key: 'app.lobby.lobbyErrorInvitationIdRequired',
  },
  {
    marker: 'between 1 and 500 characters',
    key: 'app.lobby.lobbyErrorMessageLength',
  },
];

/**
 * Failures that mean our local lobby snapshot is stale: the lobby vanished,
 * filled up, or the invitation was already consumed. Resyncing is cheap and
 * keeps the invitations list consistent with the server.
 */
const STALE_LOBBY_MARKERS = [
  'lobby no longer exists',
  'lobby is full',
  'invitation not found',
];

function normalize(message: string): string {
  return message.trim().toLowerCase();
}

/** Translation key for a raw `lobby:error` message. */
export function resolveLobbyErrorKey(message: string): TranslationKey {
  const normalized = normalize(message);
  const rule = LOBBY_ERROR_RULES.find(({ marker }) =>
    normalized.includes(marker)
  );

  return rule?.key ?? 'app.lobby.lobbyErrorGeneric';
}

/** Whether the given `lobby:error` message requires a fresh `lobby:sync`. */
export function shouldResyncLobby(message: string): boolean {
  const normalized = normalize(message);

  return STALE_LOBBY_MARKERS.some((marker) => normalized.includes(marker));
}
