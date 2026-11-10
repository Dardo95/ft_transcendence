import { describe, expect, it } from 'vitest';

import { parseMapText } from '../maps/map-loader.js';
import { createGameSession } from './game-session.factory.js';
import { checkGameOutcome } from './victory-system.js';

const MAP_TEXT = [
  '#######',
  '#1.+.2#',
  '#.#.#.#',
  '#.....#',
  '#3...4#',
  '#######',
].join('\n');

function createRunningSession() {
  const map = parseMapText('test-map', MAP_TEXT);

  const session = createGameSession({
    id: 'game-test',
    mode: 'PRIVATE',
    map,
    players: [
      { id: 'alice', displayName: 'Alice' },
      { id: 'bob', displayName: 'Bob' },
    ],
  });

  session.status = 'RUNNING';
  session.startedAtMs = 1000;

  return session;
}

describe('checkGameOutcome', () => {
  it('does not finish while two or more players are alive', () => {
    const session = createRunningSession();

    const result = checkGameOutcome(session, 2000);

    expect(result).toEqual({
      finished: false,
      newlyFinished: false,
      winnerId: null,
      isDraw: false,
      alivePlayerIds: ['alice', 'bob'],
    });

    expect(session.status).toBe('RUNNING');
    expect(session.finishedAtMs).toBeNull();
  });

  it('declares the only surviving player the winner', () => {
    const session = createRunningSession();

    session.players.get('bob')!.alive = false;

    const result = checkGameOutcome(session, 2500);

    expect(result).toEqual({
      finished: true,
      newlyFinished: true,
      winnerId: 'alice',
      isDraw: false,
      alivePlayerIds: ['alice'],
    });

    expect(session.status).toBe('FINISHED');
    expect(session.winnerId).toBe('alice');
    expect(session.finishedAtMs).toBe(2500);
  });

  it('declares a draw when all players are dead', () => {
    const session = createRunningSession();

    session.players.get('alice')!.alive = false;
    session.players.get('bob')!.alive = false;

    const result = checkGameOutcome(session, 3000);

    expect(result.finished).toBe(true);
    expect(result.newlyFinished).toBe(true);
    expect(result.winnerId).toBeNull();
    expect(result.isDraw).toBe(true);
    expect(result.alivePlayerIds).toEqual([]);

    expect(session.status).toBe('FINISHED');
    expect(session.finishedAtMs).toBe(3000);
  });

  it('does not finish during countdown', () => {
    const session = createRunningSession();

    session.status = 'COUNTDOWN';
    session.players.get('bob')!.alive = false;

    const result = checkGameOutcome(session, 1500);

    expect(result.finished).toBe(false);
    expect(result.newlyFinished).toBe(false);
    expect(session.status).toBe('COUNTDOWN');
    expect(session.finishedAtMs).toBeNull();
  });

  it('supports overtime', () => {
    const session = createRunningSession();

    session.status = 'OVERTIME';
    session.players.get('bob')!.alive = false;

    const result = checkGameOutcome(session, 4000);

    expect(result.finished).toBe(true);
    expect(result.winnerId).toBe('alice');
    expect(session.status).toBe('FINISHED');
  });

  it('does not modify a result after the game has finished', () => {
    const session = createRunningSession();

    session.players.get('bob')!.alive = false;
    checkGameOutcome(session, 2500);

    // Una llamada posterior no debe cambiar el resultado.
    session.players.get('alice')!.alive = false;

    const result = checkGameOutcome(session, 5000);

    expect(result.finished).toBe(true);
    expect(result.newlyFinished).toBe(false);
    expect(result.winnerId).toBe('alice');
    expect(result.isDraw).toBe(false);
    expect(session.finishedAtMs).toBe(2500);
  });

  it('allows a bot to win a practice match', () => {
    const map = parseMapText('test-map', MAP_TEXT);

    const session = createGameSession({
      id: 'practice-test',
      mode: 'PRACTICE',
      map,
      players: [{ id: 'alice', displayName: 'Alice' }],
    });

    session.status = 'RUNNING';
    session.players.get('alice')!.alive = false;

    const result = checkGameOutcome(session, 5000);

    expect(result.finished).toBe(true);
    expect(result.winnerId).toBe('practice-test:bot');
    expect(result.isDraw).toBe(false);
  });

  it('rejects an invalid timestamp', () => {
    const session = createRunningSession();

    expect(() => checkGameOutcome(session, Number.NaN)).toThrow(
      /nowMs must be finite/
    );
  });
});
