import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class FriendshipsService {
  constructor(private readonly prisma: PrismaService) {}

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
    const other = await this.getUserOrThrow(username);
    if (other.id === meId)
      throw new ConflictException('Cannot befriend yourself');
    const existing = await this.findBetween(meId, other.id);
    if (existing) {
      if (existing.status === 'BLOCKED')
        throw new ForbiddenException('Interaction not allowed');
      throw new ConflictException('Friend request already exists');
    }
    return this.prisma.friendship.create({
      data: { requesterId: meId, addresseeId: other.id },
    });
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
    return { message: 'Request rejected' };
  }

  async remove(meId: number, username: string) {
    const other = await this.getUserOrThrow(username);
    const fr = await this.findBetween(meId, other.id);
    if (!fr || fr.status !== 'ACCEPTED')
      throw new NotFoundException('Friendship not found');
    await this.prisma.friendship.delete({ where: { id: fr.id } });
    return { message: 'Friend removed' };
  }

  async block(meId: number, username: string) {
    const other = await this.getUserOrThrow(username);
    if (other.id === meId) throw new ConflictException('Cannot block yourself');
    const existing = await this.findBetween(meId, other.id);
    if (existing) {
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

  async listIncoming(meId: number) {
    const rows = await this.prisma.friendship.findMany({
      where: { addresseeId: meId, status: 'PENDING' },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            xp: true,
            isOnline: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r: any) => ({
      id: r.id,
      createdAt: r.createdAt,
      from: r.requester,
    }));
  }

  async listOutgoing(meId: number) {
    const rows = await this.prisma.friendship.findMany({
      where: { requesterId: meId, status: 'PENDING' },
      include: {
        addressee: {
          select: {
            id: true,
            username: true,
            xp: true,
            isOnline: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r: any) => ({
      id: r.id,
      createdAt: r.createdAt,
      to: r.addressee,
    }));
  }

  async listFriends(meId: number) {
    const rows = await this.prisma.friendship.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ requesterId: meId }, { addresseeId: meId }],
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            xp: true,
            isOnline: true,
            createdAt: true,
          },
        },
        addressee: {
          select: {
            id: true,
            username: true,
            xp: true,
            isOnline: true,
            createdAt: true,
          },
        },
      },
    });
    return rows.map((r: any) =>
      r.requesterId === meId ? r.addressee : r.requester
    );
  }
}
