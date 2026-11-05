import { Injectable, NotFoundException } from '@nestjs/common';
import type { UserPrivate, UserPublic } from '@transcendence/shared';
import { PrismaService } from '../database/prisma.service.js';
import { SearchUsersDto } from './dto/search-users.dto.js';
import { toUserPrivate, toUserPublic } from './user.mapper.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findPrivateById(id: number): Promise<UserPrivate> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        xp: true,
        isOnline: true,
        twoFaEnabled: true,
        oauthProvider: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return toUserPrivate(user);
  }

  async findByUsername(username: string): Promise<UserPublic> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        xp: true,
        isOnline: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return toUserPublic(user);
  }

  async search(dto: SearchUsersDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const where = dto.q
      ? { username: { contains: dto.q, mode: 'insensitive' as const } }
      : {};
    const [total, data] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          xp: true,
          isOnline: true,
          createdAt: true,
        },
        orderBy: { username: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
    return { data: data.map(toUserPublic), total, page, limit };
  }
}
