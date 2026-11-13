import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { UserPublic } from '@transcendence/shared';
import { PrismaService } from '../database/prisma.service.js';
import { GameManagerService } from '../game/sessions/game-manager.service.js';
import { SocketRegistryService } from '../realtime/socket-registry.service.js';
import { toUserPublic, userPublicSelect } from './user.mapper.js';

@Injectable()
export class FriendshipsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameManager: GameManagerService,
    private readonly registry: SocketRegistryService
  ) {}

  private async getUserOrThrow(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private findBetween(a: number, b: number) {
    return this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: a, addresseeId: b },
          { requesterId: b, addresseeId: a },
        ],
      },
    });
  }

  async request(meId: number, username: string) {
    const other = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true },
    });

    if (!other) {
      return { outcome: 'not_found' as const };
    }

    if (other.id === meId) {
      return { outcome: 'self' as const };
    }

    const existing = await this.findBetween(meId, other.id);
    if (existing) {
      if (existing.status === 'BLOCKED') {
        return { outcome: 'blocked' as const };
      }
      return { outcome: 'already_exists' as const, status: existing.status };
    }

    const friendship = await this.prisma.friendship.create({
      data: { requesterId: meId, addresseeId: other.id },
    });

    return { outcome: 'created' as const, ...friendship };
  }

  async accept(meId: number, id: number) {
    const fr = await this.prisma.friendship.findUnique({ where: { id } });
    if (!fr || fr.addresseeId !== meId || fr.status !== 'PENDING')
      throw new NotFoundException('Request not found');
    return this.prisma.friendship.update({
      where: { id },
      data: { status: 'ACCEPTED' },
    });
  }

  async reject(meId: number, id: number) {
    const fr = await this.prisma.friendship.findUnique({ where: { id } });
    if (!fr || fr.addresseeId !== meId || fr.status !== 'PENDING')
      throw new NotFoundException('Request not found');
    await this.prisma.friendship.delete({ where: { id } });
    return {
      message: 'Request rejected',
      requesterId: fr.requesterId,
      addresseeId: fr.addresseeId,
    };
  }

  async remove(meId: number, username: string) {
    const other = await this.getUserOrThrow(username);
    const fr = await this.findBetween(meId, other.id);
    if (!fr || fr.status !== 'ACCEPTED')
      throw new NotFoundException('Friendship not found');
    await this.prisma.friendship.delete({ where: { id: fr.id } });
    return {
      message: 'Friend removed',
      requesterId: fr.requesterId,
      addresseeId: fr.addresseeId,
    };
  }

  async block(meId: number, username: string) {
    const other = await this.getUserOrThrow(username);
    if (other.id === meId) throw new ConflictException('Cannot block yourself');
    const existing = await this.findBetween(meId, other.id);
    if (existing) {
      if (existing.status === 'BLOCKED') {
        // Already blocked by me: there is nothing to change.
        if (existing.requesterId === meId) return existing;
        // Blocked by the other user: I cannot overwrite their block.
        throw new ForbiddenException('Interaction not allowed');
      }
      return this.prisma.friendship.update({
        where: { id: existing.id },
        data: {
          status: 'BLOCKED',
          requesterId: meId,
          addresseeId: other.id,
        },
      });
    }
    return this.prisma.friendship.create({
      data: { requesterId: meId, addresseeId: other.id, status: 'BLOCKED' },
    });
  }

  async unblock(meId: number, username: string) {
    const other = await this.getUserOrThrow(username);
    const fr = await this.findBetween(meId, other.id);
    if (!fr || fr.status !== 'BLOCKED' || fr.requesterId !== meId)
      throw new NotFoundException('Block not found');
    await this.prisma.friendship.delete({ where: { id: fr.id } });
    return { message: 'User unblocked' };
  }

  async listIncoming(
    meId: number
  ): Promise<Array<{ id: number; createdAt: Date; from: UserPublic }>> {
    const rows = await this.prisma.friendship.findMany({
      where: { addresseeId: meId, status: 'PENDING' },
      include: {
        requester: {
          select: userPublicSelect,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r: any) => ({
      id: r.id,
      createdAt: r.createdAt,
      from: toUserPublic(r.requester),
    }));
  }

  async listOutgoing(
    meId: number
  ): Promise<Array<{ id: number; createdAt: Date; to: UserPublic }>> {
    const rows = await this.prisma.friendship.findMany({
      where: { requesterId: meId, status: 'PENDING' },
      include: {
        addressee: {
          select: userPublicSelect,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r: any) => ({
      id: r.id,
      createdAt: r.createdAt,
      to: toUserPublic(r.addressee),
    }));
  }

  async listFriends(meId: number): Promise<
    Array<
      UserPublic & {
        status: 'online' | 'in_game' | 'offline';
        currentGameId: string | null;
      }
    >
  > {
    const rows = await this.prisma.friendship.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ requesterId: meId }, { addresseeId: meId }],
      },
      include: {
        requester: {
          select: {
            ...userPublicSelect,
          },
        },
        addressee: {
          select: {
            ...userPublicSelect,
          },
        },
      },
    });
    return rows.map((r: any) => {
      const user = r.requesterId === meId ? r.addressee : r.requester;
      const currentGameId = this.gameManager.getActiveGameIdForUser(user.id);
      // Presence is derived from live connections (and in-memory matches)
      // instead of `User.isOnline`, which can become stale after a restart or
      // an unclean backend disconnect.
      const status = currentGameId
        ? 'in_game'
        : this.registry.isOnline('chat', user.id)
          ? 'online'
          : 'offline';
      return {
        ...toUserPublic(user),
        status,
        currentGameId,
      };
    });
  }
}
