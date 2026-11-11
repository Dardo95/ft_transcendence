import { describe, expect, it } from 'vitest';

import { resolveMatchmakingErrorKey } from './matchmakingErrorMessage';

describe('resolveMatchmakingErrorKey', () => {
  it('maps an active-game rejection to its own key', () => {
    expect(
      resolveMatchmakingErrorKey('Player 7 already has an active game')
    ).toBe('app.lobby.matchmakingActiveGame');
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
