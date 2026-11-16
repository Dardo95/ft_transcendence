import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  UpdateProfileInput,
  UpdateProfileResponse,
  UserPrivate,
  UserPublic,
} from '@transcendence/shared';
import { randomUUID } from 'node:crypto';
import { unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PrismaService } from '../database/prisma.service.js';
import * as argon2 from 'argon2';
import { SocketRegistryService } from '../realtime/socket-registry.service.js';
import { SearchUsersDto } from './dto/search-users.dto.js';
import { isValidUsername } from './username.rules.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import {
  toUserPrivate,
  toUserPublic,
  userPrivateSelect,
  userPublicSelect,
} from './user.mapper.js';

const AVATAR_EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

const AVATAR_URL_PREFIX = '/api/uploads/avatars/';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2002'
  );
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: SocketRegistryService
  ) {}

  async findPrivateById(id: number): Promise<UserPrivate> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userPrivateSelect,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return toUserPrivate(user);
  }

  async findByUsername(username: string): Promise<UserPublic> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: userPublicSelect,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.withLivePresence(toUserPublic(user));
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
        select: userPublicSelect,
        orderBy: { username: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
    return {
      data: data.map((row) => this.withLivePresence(toUserPublic(row))),
      total,
      page,
      limit,
    };
  }

  /**
   * `User.isOnline` se actualiza en la BD al conectar/desconectar, pero puede
   * quedar obsoleto si el backend se reinicia. Para perfiles públicos usamos
   * el registro de sockets, que es la fuente autoritativa en caliente.
   */
  private withLivePresence(user: UserPublic): UserPublic {
    return {
      ...user,
      isOnline: this.registry.isOnline('chat', user.id),
    };
  }

  async updatePrivate(
    id: number,
    input: UpdateProfileInput
  ): Promise<UpdateProfileResponse> {
    const data: { username?: string; email?: string } = {};

    if (input.username !== undefined) {
      const username = input.username.trim();
      if (!isValidUsername(username)) {
        return { outcome: 'invalid_username' };
      }
      data.username = username;
    }

    if (input.email !== undefined) {
      const email = input.email.trim().toLowerCase();
      if (!EMAIL_PATTERN.test(email)) {
        return { outcome: 'invalid_email' };
      }
      data.email = email;
    }

    if (data.email !== undefined) {
      await this.assertCanChangeEmail(id, data.email, input.currentPassword);
    }

    if (data.username !== undefined) {
      const existing = await this.prisma.user.findFirst({
        where: {
          username: { equals: data.username, mode: 'insensitive' },
          NOT: { id },
        },
        select: { id: true },
      });
      if (existing) return { outcome: 'username_taken' };
    }

    if (data.email !== undefined) {
      const existing = await this.prisma.user.findFirst({
        where: { email: data.email, NOT: { id } },
        select: { id: true },
      });
      if (existing) return { outcome: 'email_taken' };
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
        select: userPrivateSelect,
      });
      return { outcome: 'updated', user: toUserPrivate(user) };
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        return {
          outcome:
            data.username !== undefined ? 'username_taken' : 'email_taken',
        };
      }
      throw error;
    }
  }

  // Email changes need the current password; Google-only accounts cannot change it.
  private async assertCanChangeEmail(
    id: number,
    email: string,
    currentPassword?: string
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { email: true, password: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Same email as now: nothing changes, no password needed.
    if (user.email === email) return;

    if (user.password === null) {
      throw new ForbiddenException(
        'Email is managed by Google for this account'
      );
    }

    // 400, not 401: a 401 means "not authenticated" for the client.
    const isValid =
      currentPassword !== undefined &&
      (await argon2.verify(user.password, currentPassword));
    if (!isValid) {
      throw new BadRequestException('Current password is incorrect');
    }
  }

  async changePassword(
    id: number,
    dto: ChangePasswordDto
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { password: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Google-only accounts have no password to change.
    if (user.password === null) {
      throw new ForbiddenException('This account has no password to change');
    }

    // 400, not 401: a 401 means "not authenticated" for the client.
    const isCurrentValid = await argon2.verify(
      user.password,
      dto.currentPassword
    );
    if (!isCurrentValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (dto.newPassword === dto.currentPassword) {
      throw new BadRequestException(
        'New password must be different from the current one'
      );
    }

    await this.prisma.user.update({
      where: { id },
      data: { password: await argon2.hash(dto.newPassword) },
      select: { id: true },
    });

    return { message: 'Password updated' };
  }

  async updateAvatar(
    userId: number,
    file: { buffer: Buffer; mimetype: string }
  ): Promise<UserPrivate> {
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
        select: userPrivateSelect,
      });

      if (current.avatarUrl) {
        await this.deleteAvatarFile(current.avatarUrl);
      }

      return toUserPrivate(updated);
    } catch (error) {
      await unlink(absolutePath).catch(() => undefined);
      throw error;
    }
  }

  private async deleteAvatarFile(avatarUrl: string) {
    if (!avatarUrl.startsWith(AVATAR_URL_PREFIX)) return;

    const filename = avatarUrl.slice(AVATAR_URL_PREFIX.length);
    if (!filename || filename.includes('/')) return;

    await unlink(join(process.cwd(), 'uploads', 'avatars', filename)).catch(
      () => undefined
    );
  }
}
