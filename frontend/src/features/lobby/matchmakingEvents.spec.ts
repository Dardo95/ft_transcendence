import { describe, expect, it } from 'vitest';

import {
  countdownSeconds,
  gameRoute,
  readCancelResult,
  readGameFoundId,
  readMatchmakingStatus,
} from './matchmakingEvents';

describe('readMatchmakingStatus', () => {
  it('reads a public SEARCHING status', () => {
    expect(
      readMatchmakingStatus({
        mode: 'PUBLIC',
        status: 'SEARCHING',
        queueId: 'q1',
        lobbyId: 'l1',
        playerCount: 1,
        playersInCurrentMatch: 0,
      })
    ).toEqual({ type: 'searching' });
  });

  it('reads a COUNTDOWN with its server end time', () => {
    expect(
      readMatchmakingStatus({
        mode: 'PUBLIC',
        status: 'COUNTDOWN',
        countdownEndsAt: 1_700_000_015_000,
      })
    ).toEqual({ type: 'countdown', endsAt: 1_700_000_015_000 });
  });

  it('rejects a COUNTDOWN without a finite end time', () => {
    expect(readMatchmakingStatus({ status: 'COUNTDOWN' })).toBeNull();
    expect(
      readMatchmakingStatus({ status: 'COUNTDOWN', countdownEndsAt: 'soon' })
    ).toBeNull();
    expect(
      readMatchmakingStatus({
        status: 'COUNTDOWN',
        countdownEndsAt: Number.NaN,
      })
    ).toBeNull();
  });

  it('reads CREATED with its game id', () => {
    expect(
      readMatchmakingStatus({
        mode: 'PRIVATE',
        status: 'CREATED',
        gameId: 'g1',
      })
    ).toEqual({ type: 'created', gameId: 'g1' });
  });

  it('rejects CREATED without a game id', () => {
    expect(readMatchmakingStatus({ status: 'CREATED' })).toBeNull();
    expect(
      readMatchmakingStatus({ status: 'CREATED', gameId: '  ' })
    ).toBeNull();
  });

  it('reads CANCELLED', () => {
    expect(readMatchmakingStatus({ status: 'CANCELLED' })).toEqual({
      type: 'cancelled',
    });
  });

  it('ignores unknown statuses and malformed payloads', () => {
    expect(readMatchmakingStatus({ status: 'WHATEVER' })).toBeNull();
    expect(readMatchmakingStatus(null)).toBeNull();
    expect(readMatchmakingStatus('SEARCHING')).toBeNull();
    expect(readMatchmakingStatus(undefined)).toBeNull();
  });
});

describe('readGameFoundId', () => {
  it('reads the game id from a game:found payload', () => {
    expect(
      readGameFoundId({ gameId: 'g1', mode: 'PUBLIC', playerId: '7' })
    ).toBe('g1');
  });

  it('rejects payloads without a usable id', () => {
    expect(readGameFoundId({})).toBeNull();
    expect(readGameFoundId({ gameId: '' })).toBeNull();
    expect(readGameFoundId(null)).toBeNull();
  });
});

describe('readCancelResult', () => {
  it('accepts only an explicit true', () => {
    expect(readCancelResult({ cancelled: true })).toBe(true);
    expect(readCancelResult({ cancelled: false })).toBe(false);
    expect(readCancelResult({})).toBe(false);
    expect(readCancelResult(null)).toBe(false);
  });
});

describe('countdownSeconds', () => {
  it('rounds the remaining time up to whole seconds', () => {
    const now = 1_000;

    expect(countdownSeconds(now + 15_000, now)).toBe(15);
    expect(countdownSeconds(now + 1_001, now)).toBe(2);
    expect(countdownSeconds(now + 1, now)).toBe(1);
  });

  it('never goes below zero', () => {
    expect(countdownSeconds(500, 1_000)).toBe(0);
    expect(countdownSeconds(1_000, 1_000)).toBe(0);
  });
});

describe('gameRoute', () => {
  it('builds the game url with the selected map', () => {
    expect(gameRoute('abc', 'map2')).toBe('/game/abc?map=map2');
  });
});
