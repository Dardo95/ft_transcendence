import { describe, expect, it } from 'vitest';

import { resolveMatchmakingErrorKey } from './matchmakingErrorMessage';

describe('resolveMatchmakingErrorKey', () => {
  it('maps an active-game rejection to its own key', () => {
    expect(
      resolveMatchmakingErrorKey('Player 7 already has an active game')
    ).toBe('app.lobby.matchmakingActiveGame');
  });

  it('maps recoverable room failures to their own keys', () => {
    expect(
      resolveMatchmakingErrorKey(
        'Private matches require between 2 and 4 players'
      )
    ).toBe('app.lobby.matchmakingPrivatePlayers');

    expect(
      resolveMatchmakingErrorKey(
        'Your lobby is already searching on a different map'
      )
    ).toBe('app.lobby.matchmakingDifferentMap');

    expect(
      resolveMatchmakingErrorKey(
        'Only the lobby host can start a private match'
      )
    ).toBe('app.lobby.matchmakingHostOnly');

    expect(resolveMatchmakingErrorKey('You are not in a lobby')).toBe(
      'app.lobby.matchmakingNotInLobby'
    );
  });

  it('recognises the marker inside an object payload', () => {
    expect(
      resolveMatchmakingErrorKey({
        message: 'Player 7 already has an active game',
      })
    ).toBe('app.lobby.matchmakingActiveGame');
  });

  it('falls back to the generic key for any other failure', () => {
    expect(resolveMatchmakingErrorKey('Map "nope" does not exist')).toBe(
      'app.lobby.matchmakingFailed'
    );
    expect(resolveMatchmakingErrorKey({ message: 'Invalid request' })).toBe(
      'app.lobby.matchmakingFailed'
    );
  });

  it('falls back when the payload cannot be read', () => {
    expect(resolveMatchmakingErrorKey(undefined)).toBe(
      'app.lobby.matchmakingFailed'
    );

    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(resolveMatchmakingErrorKey(circular)).toBe(
      'app.lobby.matchmakingFailed'
    );
  });
});
