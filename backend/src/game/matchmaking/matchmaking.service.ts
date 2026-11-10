import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { randomUUID } from 'node:crypto';

import type { MatchmakingRequest } from '@transcendence/shared';

import type { WsUser } from '../../auth/ws-jwt-auth.service.js';
import {
  LobbyService,
  type LobbyMembershipChangedEvent,
  type LobbySnapshot,
} from '../../lobby/lobby.service.js';
import { GameManagerService } from '../sessions/game-manager.service.js';
import type { GameSession } from '../engine/game-state.js';
import type { GameSessionPlayerInput } from '../engine/game-session.factory.js';
import { MapRegistryService } from '../maps/map-registry.service.js';

export const PUBLIC_MATCH_COUNTDOWN_MS = 15_000;

const MAX_PLAYERS_PER_MATCH = 4;

interface QueuedLobbyGroup {
  id: string;
  lobbyId: string;
  mapId: string;
  players: GameSessionPlayerInput[];
  userIds: number[];
}

interface PublicMatchmakingBatch {
  id: string;
  mapId: string;
  groups: QueuedLobbyGroup[];
  playerCount: number;
  countdownEndsAt: number;
  timer: ReturnType<typeof setTimeout>;
}

export interface PublicMatchmakingResult {
  mode: 'PUBLIC';
  status: 'SEARCHING' | 'COUNTDOWN';
  queueId: string;
  lobbyId: string;
  playerCount: number;
  playersInCurrentMatch: number;
  countdownEndsAt?: number;
}

export interface CreatedMatchmakingResult {
  mode: 'PRIVATE' | 'PRACTICE';
  status: 'CREATED';
  session: GameSession;
}

export type MatchmakingResult =
  PublicMatchmakingResult | CreatedMatchmakingResult;

export interface MatchCreatedEvent {
  session: GameSession;
  userIds: number[];
  lobbyIds: string[];
}

export interface PublicMatchmakingStatusEvent {
  mode: 'PUBLIC';
  status: 'SEARCHING' | 'COUNTDOWN' | 'CANCELLED';
  queueId: string;
  lobbyId: string;
  userIds: number[];
  playerCount: number;
  playersInCurrentMatch: number;
  countdownEndsAt?: number;
}

type MatchmakingStatusListener = (event: PublicMatchmakingStatusEvent) => void;

type MatchCreatedListener = (event: MatchCreatedEvent) => void;

@Injectable()
export class MatchmakingService implements OnModuleDestroy {
  private readonly logger = new Logger(MatchmakingService.name);

  /** Groups waiting to be assigned to a public match, separated by map. */
  private readonly waitingGroupsByMap = new Map<string, QueuedLobbyGroup[]>();

  /** At most one public countdown is active per map in this process. */
  private readonly activeBatchesByMap = new Map<
    string,
    PublicMatchmakingBatch
  >();

  /** Prevents one account from being reserved by multiple searches. */
  private readonly groupIdByUserId = new Map<number, string>();

  private readonly matchCreatedListeners = new Set<MatchCreatedListener>();

  private readonly statusListeners = new Set<MatchmakingStatusListener>();

  private readonly unsubscribeFromLobbyChanges: () => void;

  constructor(
    private readonly lobbyService: LobbyService,
    private readonly gameManager: GameManagerService,
    private readonly mapRegistry: MapRegistryService
  ) {
    this.unsubscribeFromLobbyChanges =
      this.lobbyService.subscribeToMembershipChanges((event) => {
        this.handleLobbyMembershipChanged(event);
      });
  }

  onModuleDestroy(): void {
    this.unsubscribeFromLobbyChanges();

    for (const batch of this.activeBatchesByMap.values()) {
      clearTimeout(batch.timer);
    }

    this.activeBatchesByMap.clear();
    this.waitingGroupsByMap.clear();
    this.groupIdByUserId.clear();
    this.statusListeners.clear();
    this.matchCreatedListeners.clear();
  }

  subscribeToStatusChanges(listener: MatchmakingStatusListener): () => void {
    this.statusListeners.add(listener);

    return () => {
      this.statusListeners.delete(listener);
    };
  }

  /**
   * Entry point for all three matchmaking modes.
   * Settings are intentionally not applied yet; map and mode are authoritative.
   */
  requestMatchmaking(
    user: WsUser,
    request: MatchmakingRequest
  ): MatchmakingResult {
    this.assertMapExists(request.mapId);

    switch (request.mode) {
      case 'PUBLIC':
        return this.requestPublicMatch(user, request.mapId);
      case 'PRIVATE':
        return this.requestPrivateMatch(user, request.mapId);
      case 'PRACTICE':
        return this.requestPracticeMatch(user, request.mapId);
      default:
        throw new WsException('Unsupported game mode');
    }
  }

  /**
   * Cancels the caller's search. Public searches are lobby-wide, so cancelling
   * any member removes the complete group rather than splitting it.
   */

  cancelMatchmaking(userId: number): boolean {
    const groupId = this.groupIdByUserId.get(userId);

    if (!groupId) {
      return false;
    }

    const cancelled = this.cancelGroup(groupId);

    if (!cancelled) {
      // Limpieza defensiva de reservas huérfanas.
      this.groupIdByUserId.delete(userId);
    }

    return cancelled;
  }

  private handleLobbyMembershipChanged(
    event: LobbyMembershipChangedEvent
  ): void {
    const group = this.findGroupByLobbyId(event.lobbyId);

    if (!group) {
      return;
    }

    const expected = [...group.userIds].sort((a, b) => a - b);
    const actual = [...event.memberIds].sort((a, b) => a - b);

    const membershipIsUnchanged =
      expected.length === actual.length &&
      expected.every((userId, index) => userId === actual[index]);

    if (!membershipIsUnchanged) {
      // La composición del grupo ha cambiado.
      // Cancelamos el grupo completo, nunca lo dividimos.
      this.cancelGroup(group.id);
    }
  }

  private cancelGroup(groupId: string): boolean {
    for (const [mapId, batch] of this.activeBatchesByMap) {
      const group = batch.groups.find((candidate) => candidate.id === groupId);

      if (!group) {
        continue;
      }

      batch.groups = batch.groups.filter(
        (candidate) => candidate.id !== groupId
      );

      batch.playerCount -= group.players.length;

      this.releaseGroup(group);
      this.notifyGroupStatus(group, 'CANCELLED');

      if (batch.playerCount < 2) {
        clearTimeout(batch.timer);
        this.activeBatchesByMap.delete(mapId);

        const waiting = this.waitingGroupsByMap.get(mapId) ?? [];

        this.waitingGroupsByMap.set(mapId, [...batch.groups, ...waiting]);
      }

      this.tryStartNextBatch(mapId);

      return true;
    }

    for (const [mapId, waiting] of this.waitingGroupsByMap) {
      const group = waiting.find((candidate) => candidate.id === groupId);

      if (!group) {
        continue;
      }

      this.waitingGroupsByMap.set(
        mapId,
        waiting.filter((candidate) => candidate.id !== groupId)
      );

      this.releaseGroup(group);
      this.notifyGroupStatus(group, 'CANCELLED');

      this.tryStartNextBatch(mapId);

      return true;
    }

    return false;
  }

  /** Subscribe to sessions created by public, private or practice matchmaking. */
  subscribeToMatchCreation(listener: MatchCreatedListener): () => void {
    this.matchCreatedListeners.add(listener);

    return () => {
      this.matchCreatedListeners.delete(listener);
    };
  }

  private requestPublicMatch(
    user: WsUser,
    mapId: string
  ): PublicMatchmakingResult {
    const lobby = this.getUserLobby(user.id);
    const existingGroup = this.findGroupByLobbyId(lobby.id);

    if (existingGroup) {
      if (existingGroup.mapId !== mapId) {
        throw new WsException(
          'Your lobby is already searching on a different map'
        );
      }

      this.assertSameLobbyMembers(existingGroup, lobby);

      const result = this.toPublicResult(existingGroup);

      this.notifyGroupStatus(existingGroup, result.status, result);

      return result;
    }

    const group = this.createLobbyGroup(lobby, mapId);
    this.assertUsersAvailable(group.userIds);

    this.enqueueGroup(group);
    this.tryStartNextBatch(mapId);

    return this.toPublicResult(group);
  }

  private requestPrivateMatch(
    user: WsUser,
    mapId: string
  ): CreatedMatchmakingResult {
    const lobby = this.getUserLobby(user.id);

    if (
      lobby.members.length < 2 ||
      lobby.members.length > MAX_PLAYERS_PER_MATCH
    ) {
      throw new WsException('Private matches require between 2 and 4 players');
    }

    const players = this.toSessionPlayers(lobby);
    this.assertUsersAvailable(lobby.members.map((member) => member.userId));

    const session = this.gameManager.createSession({
      mode: 'PRIVATE',
      mapId,
      players,
    });

    this.notifyMatchCreated({
      session,
      userIds: lobby.members.map((member) => member.userId),
      lobbyIds: [lobby.id],
    });

    return { mode: 'PRIVATE', status: 'CREATED', session };
  }

  private requestPracticeMatch(
    user: WsUser,
    mapId: string
  ): CreatedMatchmakingResult {
    this.assertUsersAvailable([user.id]);

    const session = this.gameManager.createSession({
      mode: 'PRACTICE',
      mapId,
      players: [
        {
          id: String(user.id),
          userId: String(user.id),
          displayName: user.username,
        },
      ],
    });

    const lobby = this.lobbyService.getLobbyForUser(user.id);

    this.notifyMatchCreated({
      session,
      userIds: [user.id],
      lobbyIds: lobby ? [lobby.id] : [],
    });

    return { mode: 'PRACTICE', status: 'CREATED', session };
  }

  private getUserLobby(userId: number): LobbySnapshot {
    const lobby = this.lobbyService.getLobbyForUser(userId);

    if (!lobby) {
      throw new WsException('You must be in a lobby to start this match');
    }

    if (lobby.members.length === 0) {
      throw new WsException('Your lobby is empty');
    }

    if (lobby.members.length > MAX_PLAYERS_PER_MATCH) {
      throw new WsException('A lobby cannot have more than 4 players');
    }

    return lobby;
  }

  private createLobbyGroup(
    lobby: LobbySnapshot,
    mapId: string
  ): QueuedLobbyGroup {
    return {
      id: randomUUID(),
      lobbyId: lobby.id,
      mapId,
      players: this.toSessionPlayers(lobby),
      userIds: lobby.members.map((member) => member.userId),
    };
  }

  private toSessionPlayers(lobby: LobbySnapshot): GameSessionPlayerInput[] {
    return lobby.members.map((member) => ({
      id: String(member.userId),
      userId: String(member.userId),
      displayName: member.username,
    }));
  }

  private assertMapExists(mapId: string): void {
    if (typeof mapId !== 'string' || !mapId.trim()) {
      throw new WsException('A valid map ID is required');
    }

    if (!this.mapRegistry.hasMap(mapId)) {
      throw new WsException(`Map "${mapId}" does not exist`);
    }
  }

  private assertUsersAvailable(userIds: number[]): void {
    for (const userId of userIds) {
      if (this.groupIdByUserId.has(userId)) {
        throw new WsException(
          `Player ${userId} is already reserved for matchmaking`
        );
      }

      if (this.gameManager.hasActiveSessionForUser(userId)) {
        throw new WsException(`Player ${userId} already has an active game`);
      }
    }
  }

  private assertSameLobbyMembers(
    group: QueuedLobbyGroup,
    lobby: LobbySnapshot
  ): void {
    const expected = [...group.userIds].sort((a, b) => a - b);
    const actual = lobby.members
      .map((member) => member.userId)
      .sort((a, b) => a - b);

    if (
      expected.length !== actual.length ||
      expected.some((userId, index) => userId !== actual[index])
    ) {
      throw new WsException(
        'Lobby membership changed while matchmaking; cancel and search again'
      );
    }
  }

  private enqueueGroup(group: QueuedLobbyGroup): void {
    const waiting = this.waitingGroupsByMap.get(group.mapId) ?? [];

    waiting.push(group);
    this.waitingGroupsByMap.set(group.mapId, waiting);

    for (const userId of group.userIds) {
      this.groupIdByUserId.set(userId, group.id);
    }
  }

  /**
   * Starts a new batch once a compatible set of whole lobby groups can form
   * a match of 2-4 players. During its 15-second countdown, later groups are
   * added only when the complete group fits in the remaining slots.
   */
  private tryStartNextBatch(mapId: string): void {
    const activeBatch = this.activeBatchesByMap.get(mapId);

    if (activeBatch) {
      this.fillActiveBatch(activeBatch);
      this.notifyMapStatuses(mapId);
      return;
    }

    const waiting = this.waitingGroupsByMap.get(mapId) ?? [];
    const selected = this.selectInitialGroups(waiting);

    if (selected.length === 0) {
      this.notifyMapStatuses(mapId);
      return;
    }

    const selectedIds = new Set(selected.map((group) => group.id));

    const remaining = waiting.filter((group) => !selectedIds.has(group.id));

    this.waitingGroupsByMap.set(mapId, remaining);

    const playerCount = selected.reduce(
      (count, group) => count + group.players.length,
      0
    );

    const batchId = randomUUID();
    const countdownEndsAt = Date.now() + PUBLIC_MATCH_COUNTDOWN_MS;

    const batch: PublicMatchmakingBatch = {
      id: batchId,
      mapId,
      groups: selected,
      playerCount,
      countdownEndsAt,
      timer: setTimeout(() => {
        this.finishPublicBatch(mapId, batchId);
      }, PUBLIC_MATCH_COUNTDOWN_MS),
    };

    this.activeBatchesByMap.set(mapId, batch);

    this.fillActiveBatch(batch);
    this.notifyMapStatuses(mapId);
  }

  /**
   * Prefer the oldest group that can form a match, or the oldest compatible
   * pair of groups. A large group that does not fit is kept whole for a later
   * batch; it does not block unrelated groups that can form another match.
   */
  private selectInitialGroups(waiting: QueuedLobbyGroup[]): QueuedLobbyGroup[] {
    for (let i = 0; i < waiting.length; i++) {
      const first = waiting[i];

      if (first.players.length >= 2) {
        return [first];
      }

      for (let j = i + 1; j < waiting.length; j++) {
        const second = waiting[j];

        if (
          first.players.length + second.players.length <=
          MAX_PLAYERS_PER_MATCH
        ) {
          return [first, second];
        }
      }
    }

    return [];
  }

  private fillActiveBatch(batch: PublicMatchmakingBatch): void {
    const waiting = this.waitingGroupsByMap.get(batch.mapId) ?? [];
    const remaining: QueuedLobbyGroup[] = [];

    for (const group of waiting) {
      if (batch.playerCount + group.players.length <= MAX_PLAYERS_PER_MATCH) {
        batch.groups.push(group);
        batch.playerCount += group.players.length;
      } else {
        remaining.push(group);
      }
    }

    this.waitingGroupsByMap.set(batch.mapId, remaining);
  }

  private finishPublicBatch(mapId: string, batchId: string): void {
    const batch = this.activeBatchesByMap.get(mapId);

    if (!batch || batch.id !== batchId) {
      return;
    }

    clearTimeout(batch.timer);
    this.activeBatchesByMap.delete(mapId);

    const validGroups = batch.groups.filter((group) =>
      this.isLobbyGroupStillValid(group)
    );
    const invalidGroups = batch.groups.filter(
      (group) => !validGroups.includes(group)
    );

    for (const group of invalidGroups) {
      this.releaseGroup(group);
    }

    const playerCount = validGroups.reduce(
      (count, group) => count + group.players.length,
      0
    );

    if (playerCount >= 2) {
      const players = validGroups.flatMap((group) => group.players);

      try {
        const session = this.gameManager.createSession({
          mode: 'PUBLIC',
          mapId,
          players,
        });

        const event: MatchCreatedEvent = {
          session,
          userIds: validGroups.flatMap((group) => group.userIds),
          lobbyIds: validGroups.map((group) => group.lobbyId),
        };

        for (const group of validGroups) {
          this.releaseGroup(group);
        }

        this.notifyMatchCreated(event);
      } catch (error) {
        for (const group of validGroups) {
          this.releaseGroup(group);
          this.notifyGroupStatus(group, 'CANCELLED');
        }

        this.logger.error(
          `Could not create public match for map "${mapId}": ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    } else {
      // If a group changed while the countdown was running, keep any
      // remaining valid solo group searching rather than starting alone.
      const waiting = this.waitingGroupsByMap.get(mapId) ?? [];
      this.waitingGroupsByMap.set(mapId, [...validGroups, ...waiting]);
    }

    this.tryStartNextBatch(mapId);
  }

  private isLobbyGroupStillValid(group: QueuedLobbyGroup): boolean {
    const lobby = this.lobbyService.getLobbyById(group.lobbyId);

    if (!lobby) {
      return false;
    }

    const expected = [...group.userIds].sort((a, b) => a - b);
    const actual = lobby.members
      .map((member) => member.userId)
      .sort((a, b) => a - b);

    return (
      expected.length === actual.length &&
      expected.every((userId, index) => userId === actual[index])
    );
  }

  private toPublicResult(group: QueuedLobbyGroup): PublicMatchmakingResult {
    const activeBatch = this.activeBatchesByMap.get(group.mapId);
    const isInCountdown = activeBatch?.groups.some(
      (candidate) => candidate.id === group.id
    );

    if (activeBatch && isInCountdown) {
      return {
        mode: 'PUBLIC',
        status: 'COUNTDOWN',
        queueId: group.id,
        lobbyId: group.lobbyId,
        playerCount: group.players.length,
        playersInCurrentMatch: activeBatch.playerCount,
        countdownEndsAt: activeBatch.countdownEndsAt,
      };
    }

    return {
      mode: 'PUBLIC',
      status: 'SEARCHING',
      queueId: group.id,
      lobbyId: group.lobbyId,
      playerCount: group.players.length,
      playersInCurrentMatch: 0,
    };
  }

  private findGroupByLobbyId(lobbyId: string): QueuedLobbyGroup | undefined {
    for (const batch of this.activeBatchesByMap.values()) {
      const group = batch.groups.find(
        (candidate) => candidate.lobbyId === lobbyId
      );

      if (group) {
        return group;
      }
    }

    for (const waiting of this.waitingGroupsByMap.values()) {
      const group = waiting.find((candidate) => candidate.lobbyId === lobbyId);

      if (group) {
        return group;
      }
    }

    return undefined;
  }

  private releaseGroup(group: QueuedLobbyGroup): void {
    for (const userId of group.userIds) {
      if (this.groupIdByUserId.get(userId) === group.id) {
        this.groupIdByUserId.delete(userId);
      }
    }
  }

  private notifyMapStatuses(mapId: string): void {
    const active = this.activeBatchesByMap.get(mapId);
    const waiting = this.waitingGroupsByMap.get(mapId) ?? [];

    const groups = [...(active?.groups ?? []), ...waiting];

    for (const group of groups) {
      const result = this.toPublicResult(group);

      this.notifyGroupStatus(group, result.status, result);
    }
  }

  private notifyGroupStatus(
    group: QueuedLobbyGroup,
    status: PublicMatchmakingStatusEvent['status'],
    result?: PublicMatchmakingResult
  ): void {
    const event: PublicMatchmakingStatusEvent = {
      mode: 'PUBLIC',
      status,
      queueId: group.id,
      lobbyId: group.lobbyId,
      userIds: [...group.userIds],
      playerCount: group.players.length,
      playersInCurrentMatch: result?.playersInCurrentMatch ?? 0,
      ...(result?.countdownEndsAt !== undefined
        ? { countdownEndsAt: result.countdownEndsAt }
        : {}),
    };

    for (const listener of this.statusListeners) {
      try {
        listener(event);
      } catch (error) {
        this.logger.error(
          `Matchmaking status listener failed: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  }

  private notifyMatchCreated(event: MatchCreatedEvent): void {
    for (const listener of this.matchCreatedListeners) {
      try {
        listener(event);
      } catch (error) {
        this.logger.error(
          `Match-start listener failed: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  }
}
