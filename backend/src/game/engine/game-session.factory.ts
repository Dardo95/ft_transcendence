import type { GameMode, Position } from '@transcendence/shared';

import { GAME_DEFAULTS } from '../config/game-defaults.js';
import type { LoadedMap } from '../maps/map-loader.js';

import { createGameBoard } from './game-board.js';
import type { GamePlayer, GameSession } from './game-state.js';

import { monotonicNowMs } from './clock.js';

export interface GameSessionPlayerInput {
  /**
   * Identificador del participante en esta partida.
   */
  id: string;

  /**
   * Identificador de la cuenta, si existe.
   * Los bots no tienen cuenta de usuario.
   */
  userId?: string;

  displayName: string;
}

export interface CreateGameSessionOptions {
  id: string;
  mode: GameMode;
  map: LoadedMap;

  /**
   * Participantes humanos.
   * En PRACTICE debe haber exactamente uno:
   * el bot se crea automáticamente.
   */
  players: GameSessionPlayerInput[];

  /**
   * Permite fijar el tiempo durante las pruebas.
   */
  nowMs?: number;
}

const BOT_DISPLAY_NAME = 'Chef Bot';

function validatePlayers(
  mode: GameMode,
  players: GameSessionPlayerInput[]
): void {
  if (mode === 'PRACTICE') {
    if (players.length !== 1) {
      throw new Error('Practice mode requires exactly one human player');
    }

    return;
  }

  if (players.length < 2 || players.length > 4) {
    throw new Error(`${mode} mode requires between 2 and 4 players`);
  }
}

function getSpawnOrder(playerCount: number): number[] {
  switch (playerCount) {
    case 2:
      // Posiciones opuestas del tablero.
      return [1, 4];

    case 3:
      return [1, 2, 3];

    case 4:
      return [1, 2, 3, 4];

    default:
      throw new Error(`Unsupported player count: ${playerCount}`);
  }
}

function createPlayer(
  input: GameSessionPlayerInput,
  spawnPoint: Position,
  isBot: boolean
): GamePlayer {
  return {
    id: input.id,
    ...(input.userId ? { userId: input.userId } : {}),
    displayName: input.displayName,
    isBot,

    // Aparecer en el centro de la casilla.
    position: {
      x: spawnPoint.x + 0.5,
      y: spawnPoint.y + 0.5,
    },

    alive: true,

    speedTilesPerSecond: GAME_DEFAULTS.defaultSpeedTilesPerSecond,
    bombCapacity: GAME_DEFAULTS.defaultBombCapacity,
    blastRadius: GAME_DEFAULTS.defaultBlastRadius,

    activeBombIds: new Set<string>(),

    movementInput: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
  };
}

export function createGameSession(
  options: CreateGameSessionOptions
): GameSession {
  const { id, mode, map, players } = options;

  if (!id.trim()) {
    throw new Error('Game session ID cannot be empty');
  }

  if (!map.id) {
    throw new Error('Map ID cannot be empty');
  }

  validatePlayers(mode, players);

  // Evita participantes duplicados.
  const participantIds = players.map((player) => player.id);

  if (
    participantIds.some((participantId) => !participantId.trim()) ||
    new Set(participantIds).size !== participantIds.length
  ) {
    throw new Error('Player IDs must be non-empty and unique');
  }

  if (players.some((player) => !player.displayName.trim())) {
    throw new Error('Player display names cannot be empty');
  }

  // El bot se genera exclusivamente en el servidor.
  const roster: Array<{
    input: GameSessionPlayerInput;
    isBot: boolean;
  }> = players.map((player) => ({
    input: player,
    isBot: false,
  }));

  if (mode === 'PRACTICE') {
    const botId = `${id}:bot`;

    if (participantIds.includes(botId)) {
      throw new Error('Bot ID conflicts with a player ID');
    }

    roster.push({
      input: {
        id: botId,
        displayName: BOT_DISPLAY_NAME,
      },
      isBot: true,
    });
  }

  const spawnOrder = getSpawnOrder(roster.length);
  const sessionPlayers = new Map<string, GamePlayer>();

  roster.forEach(({ input, isBot }, index) => {
    const spawnId = spawnOrder[index];
    const spawnPosition = map.spawnPoints[spawnId];

    if (!spawnPosition) {
      throw new Error(`Map ${map.id} is missing spawn point ${spawnId}`);
    }

    const { x, y } = spawnPosition;
    const terrain = map.tiles[y]?.[x];

    if (terrain !== 'FLOOR') {
      throw new Error(`Spawn point ${spawnId} is not on floor`);
    }

    sessionPlayers.set(input.id, createPlayer(input, spawnPosition, isBot));
  });

  return {
    id,
    mode,
    status: 'COUNTDOWN',

    board: createGameBoard(map),
    players: sessionPlayers,

    bombs: new Map(),
    explosions: new Map(),
    powerUps: new Map(),

    createdAtMs: options.nowMs ?? monotonicNowMs(),
    startedAtMs: null,
    finishedAtMs: null,

    winnerId: null,
  };
}
