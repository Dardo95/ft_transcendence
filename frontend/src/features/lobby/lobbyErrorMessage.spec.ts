import { describe, expect, it } from 'vitest';

import { resolveLobbyErrorKey, shouldResyncLobby } from './lobbyErrorMessage';

describe('resolveLobbyErrorKey', () => {
  it.each([
    ['Username is required', 'app.lobby.lobbyErrorUsernameRequired'],
    ['User not found', 'app.lobby.lobbyErrorUserNotFound'],
    ['You can only invite accepted friends', 'app.lobby.lobbyErrorNotFriends'],
    [
      'Only the host can invite friends',
      'app.lobby.lobbyErrorOnlyHostCanInvite',
    ],
    ['Cannot invite yourself', 'app.lobby.lobbyErrorCannotInviteSelf'],
    [
      'User is already in a lobby with other members',
      'app.lobby.lobbyErrorInviteeInGroup',
    ],
    ['Lobby is full', 'app.lobby.lobbyErrorLobbyFull'],
    ['Invitation already exists', 'app.lobby.lobbyErrorInvitationExists'],
    ['Invitation not found', 'app.lobby.lobbyErrorInvitationNotFound'],
    ['Lobby no longer exists', 'app.lobby.lobbyErrorLobbyGone'],
    ['You are not in a lobby', 'app.lobby.lobbyErrorNotInLobby'],
    ['You are already in a lobby', 'app.lobby.lobbyErrorAlreadyInLobby'],
    ['Invitation ID is required', 'app.lobby.lobbyErrorInvitationIdRequired'],
    [
      'Message must contain between 1 and 500 characters',
      'app.lobby.lobbyErrorMessageLength',
    ],
  ])('maps %s to its own key', (message, expected) => {
    expect(resolveLobbyErrorKey(message)).toBe(expected);
  });

  it('is case-insensitive and falls back to the generic key', () => {
    expect(resolveLobbyErrorKey('LOBBY IS FULL')).toBe(
      'app.lobby.lobbyErrorLobbyFull'
    );
    expect(resolveLobbyErrorKey('Unexpected server failure')).toBe(
      'app.lobby.lobbyErrorGeneric'
    );
  });
});

describe('shouldResyncLobby', () => {
  it('requests a resync when the local lobby snapshot is stale', () => {
    expect(shouldResyncLobby('Lobby no longer exists')).toBe(true);
    expect(shouldResyncLobby('Lobby is full')).toBe(true);
    expect(shouldResyncLobby('Invitation not found')).toBe(true);
  });

  it('keeps the current snapshot for unrelated failures', () => {
    expect(shouldResyncLobby('Cannot invite yourself')).toBe(false);
    expect(shouldResyncLobby('Unexpected server failure')).toBe(false);
  });
});
