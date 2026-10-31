import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import type { GameMode } from '@transcendence/shared';

import { MapRegistryService } from '../maps/map-registry.service.js';

import {
  createGameSession,
  type GameSessionPlayerInput,
} from '../engine/game-session.factory.js';

import type { GameSession } from '../engine/game-state.js';

import { GameLoop } from '../engine/game-loop.js';

import type { GameTickResult } from '../engine/game-engine.js';

export interface CreateManagedGameInput {
  mode: GameMode;
  mapId: string;
  players: GameSessionPlayerInput[];
}

export type GameTickListener = (
  session: GameSession,
  result: GameTickResult
) => void;

@Injectable()
export class GameManagerService implements OnModuleInit, OnModuleDestroy {
  private readonly sessions = new Map<string, GameSession>();

  private readonly tickListeners = new Set<GameTickListener>();

  private readonly gameLoop: GameLoop;

  constructor(private readonly mapRegistry: MapRegistryService) {
    this.gameLoop = new GameLoop({
      getSessions: () => this.sessions.values(),

      onTick: (session, result) => {
        this.notifyTickListeners(session, result);
      },

      onError: (error, session) => {
        console.error(`Error in game ${session.id}:`, error);
      },
    });
  }

  onModuleInit(): void {
    this.gameLoop.start();
  }

  onModuleDestroy(): void {
    this.gameLoop.stop();
  }

  /**
   * Crea y registra una sesión nueva.
   *
   * El identificador y el momento de creación los
   * determina el servidor.
   */
  createSession(input: CreateManagedGameInput): GameSession {
    this.assertPlayersAvailable(input.players);

    // Resolver el mapa mediante su identificador.
    const map = this.mapRegistry.getMap(input.mapId);

    const session = createGameSession({
      id: randomUUID(),
      mode: input.mode,
      map,
      players: input.players,
      nowMs: this.gameLoop.nowMs(),
    });

    if (this.sessions.has(session.id)) {
      throw new Error(`Game session ${session.id} already exists`);
    }

    this.sessions.set(session.id, session);

    return session;
  }

  getSession(gameId: string): GameSession | undefined {
    return this.sessions.get(gameId);
  }

  getActiveSessions(): GameSession[] {
    return [...this.sessions.values()].filter(
      (session) => session.status !== 'FINISHED'
    );
  }

  getNowMs(): number {
    return this.gameLoop.nowMs();
  }

  isLoopRunning(): boolean {
    return this.gameLoop.isRunning();
  }

  /**
   * Solo elimina partidas que ya han terminado.
   *
   * La persistencia y notificación del resultado deberán
   * procesarse antes de retirar una sesión.
   */
  removeFinishedSession(gameId: string): boolean {
    const session = this.sessions.get(gameId);

    if (!session || session.status !== 'FINISHED') {
      return false;
    }

    return this.sessions.delete(gameId);
  }

  /**
   * Permite que otros servicios reciban las actualizaciones
   * del motor. Devuelve una función para cancelar la suscripción.
   */
  subscribeToTicks(listener: GameTickListener): () => void {
    this.tickListeners.add(listener);

    return () => {
      this.tickListeners.delete(listener);
    };
  }

  private assertPlayersAvailable(players: GameSessionPlayerInput[]): void {
    const incomingIdentities = players.map(
      (player) => player.userId ?? player.id
    );

    for (const session of this.sessions.values()) {
      if (session.status === 'FINISHED') {
        continue;
      }

      for (const currentPlayer of session.players.values()) {
        const currentIdentity = currentPlayer.userId ?? currentPlayer.id;

        if (incomingIdentities.includes(currentIdentity)) {
          throw new Error(
            `Player ${currentIdentity} already has an active game`
          );
        }
      }
    }
  }

  private notifyTickListeners(
    session: GameSession,
    result: GameTickResult
  ): void {
    for (const listener of this.tickListeners) {
      try {
        listener(session, result);
      } catch (error) {
        // Un consumidor defectuoso no debe impedir
        // que el resto reciba la actualización.
        console.error(
          `Error notifying game tick listener for ${session.id}:`,
          error
        );
      }
    }
  }
}
