import { describe, expect, it } from 'vitest';

import { parseMapText } from '../maps/map-loader.js';
import { createGameSession } from './game-session.factory.js';
import {
  setPlayerMovementInput,
  updatePlayerMovement,
} from './movement-system.js';

import { placeBomb } from './bomb-system.js';

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
  return session;
}

const RIGHT = {
  up: false,
  down: false,
  left: false,
  right: true,
};

describe('continuous movement', () => {
  it('moves according to speed and elapsed time', () => {
    const session = createRunningSession();

    setPlayerMovementInput(session, 'alice', RIGHT);
    updatePlayerMovement(session, 0.05);

    expect(session.players.get('alice')?.position.x).toBeCloseTo(1.7);

    expect(session.players.get('alice')?.position.y).toBeCloseTo(1.5);
  });

  it('does not pass through a destructible wall', () => {
    const session = createRunningSession();

    setPlayerMovementInput(session, 'alice', RIGHT);

    for (let i = 0; i < 20; i++) {
      updatePlayerMovement(session, 0.05);
    }

    const position = session.players.get('alice')!.position;

    // El muro ocupa la casilla x=3.
    // Con una semianchura de 0.3, el centro del
    // jugador no puede superar aproximadamente x=2.7.
    expect(position.x).toBeGreaterThan(2.65);
    expect(position.x).toBeLessThanOrEqual(2.700001);
    expect(position.y).toBeCloseTo(1.5);
  });

  it('normalizes diagonal movement', () => {
    const session = createRunningSession();

    setPlayerMovementInput(session, 'alice', {
      up: false,
      down: true,
      left: false,
      right: true,
    });

    updatePlayerMovement(session, 0.05);

    const position = session.players.get('alice')!.position;

    const dx = position.x - 1.5;
    const dy = position.y - 1.5;

    expect(dx).toBeCloseTo(dy);
    expect(Math.hypot(dx, dy)).toBeCloseTo(0.2);
  });

  it('stops when movement input is released', () => {
    const session = createRunningSession();

    setPlayerMovementInput(session, 'alice', RIGHT);
    updatePlayerMovement(session, 0.05);

    setPlayerMovementInput(session, 'alice', {
      up: false,
      down: false,
      left: false,
      right: false,
    });

    const positionAfterRelease = {
      ...session.players.get('alice')!.position,
    };

    updatePlayerMovement(session, 0.05);

    expect(session.players.get('alice')!.position).toEqual(
      positionAfterRelease
    );
  });

  it('rejects input during countdown', () => {
    const session = createRunningSession();
    session.status = 'COUNTDOWN';

    const result = setPlayerMovementInput(session, 'alice', RIGHT);

    expect(result).toEqual({
      success: false,
      reason: 'GAME_NOT_RUNNING',
    });
  });

  it('does not move dead players', () => {
    const session = createRunningSession();
    const alice = session.players.get('alice')!;

    alice.alive = false;

    const initialPosition = { ...alice.position };

    updatePlayerMovement(session, 0.05);

    expect(alice.position).toEqual(initialPosition);
  });

  it('does not allow external movement input for the bot', () => {
    const map = parseMapText('test-map', MAP_TEXT);

    const session = createGameSession({
      id: 'practice-test',
      mode: 'PRACTICE',
      map,
      players: [{ id: 'alice', displayName: 'Alice' }],
    });

    session.status = 'RUNNING';

    const bot = session.players.get('practice-test:bot')!;

    const initialPosition = { ...bot.position };

    expect(setPlayerMovementInput(session, bot.id, RIGHT)).toEqual({
      success: false,
      reason: 'BOT_CONTROLLED',
    });

    updatePlayerMovement(session, 0.05);

    expect(bot.position).toEqual(initialPosition);
  });

  it('allows the owner to leave a newly placed bomb', () => {
    const session = createRunningSession();

    placeBomb(session, 'alice', 'bomb-1', 1000);

    setPlayerMovementInput(session, 'alice', {
      up: false,
      down: false,
      left: false,
      right: true,
    });

    updatePlayerMovement(session, 0.05);

    expect(session.players.get('alice')!.position.x).toBeCloseTo(1.7);

    expect(session.bombs.get('bomb-1')!.passThroughPlayerIds.has('alice')).toBe(
      true
    );
  });

  it('prevents the owner from re-entering the bomb tile', () => {
    const session = createRunningSession();

    placeBomb(session, 'alice', 'bomb-1', 1000);

    setPlayerMovementInput(session, 'alice', {
      up: false,
      down: false,
      left: false,
      right: true,
    });

    for (let i = 0; i < 5; i++) {
      updatePlayerMovement(session, 0.05);
    }

    const bomb = session.bombs.get('bomb-1')!;
    const alice = session.players.get('alice')!;

    expect(bomb.passThroughPlayerIds.has('alice')).toBe(false);

    const positionAfterLeaving = { ...alice.position };

    setPlayerMovementInput(session, 'alice', {
      up: false,
      down: false,
      left: true,
      right: false,
    });

    updatePlayerMovement(session, 0.05);

    expect(alice.position.x).toBeGreaterThanOrEqual(2.29);
    expect(alice.position.x).toBeLessThanOrEqual(positionAfterLeaving.x);
  });

  it('prevents another player from entering a bomb tile', () => {
    const session = createRunningSession();

    placeBomb(session, 'alice', 'bomb-1', 1000);

    // Bob empieza a la derecha de la bomba.
    session.players.get('bob')!.position = {
      x: 2.5,
      y: 1.5,
    };

    setPlayerMovementInput(session, 'bob', {
      up: false,
      down: false,
      left: true,
      right: false,
    });

    updatePlayerMovement(session, 0.2);

    expect(session.players.get('bob')!.position.x).toBeGreaterThanOrEqual(2.29);
  });
});
