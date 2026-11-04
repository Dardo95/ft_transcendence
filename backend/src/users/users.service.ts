import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { UserPublicDto } from './dto/user-public.dto.js';
import { SearchUsersDto } from './dto/search-users.dto.js';
import { randomUUID } from 'node:crypto';
import { unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const AVATAR_EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

const AVATAR_URL_PREFIX = '/api/uploads/avatars/';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        xp: true,
        isOnline: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByUsername(username: string): Promise<UserPublicDto> {
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
    return user;
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
    return { data, total, page, limit };
  }

  async updateAvatar(
    userId: number,
    file: { buffer: Buffer; mimetype: string }
  ) {
    const extension = AVATAR_EXTENSIONS[file.mimetype];
    if (!extension) {
      throw new BadRequestException('Unsupported image type');
    }

    const current = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true },
    });
    if (!current) {
      throw new NotFoundException('User not found');
    }

    const filename = `${userId}-${randomUUID()}.${extension}`;
    const absolutePath = join(process.cwd(), 'uploads', 'avatars', filename);

    await writeFile(absolutePath, file.buffer);

    try {
      const updated = await this.prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: `${AVATAR_URL_PREFIX}${filename}` },
        select: {
          id: true,
          username: true,
          email: true,
          xp: true,
          isOnline: true,
          createdAt: true,
          avatarUrl: true,
        },
      });

      if (current.avatarUrl) {
        await this.deleteAvatarFile(current.avatarUrl);
      }

      return updated;
    } catch (error) {
      await unlink(absolutePath).catch(() => undefined);
      throw error;
    }
  }

  private async deleteAvatarFile(avatarUrl: string) {
    if (!avatarUrl.startsWith(AVATAR_URL_PREFIX)) return;

    const filename = avatarUrl.slice(AVATAR_URL_PREFIX.length);
    if (!filename || filename.includes('/')) return;

    await unlink(
      join(process.cwd(), 'uploads', 'avatars', filename)
    ).catch(() => undefined);
  }
}
