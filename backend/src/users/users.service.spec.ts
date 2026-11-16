import * as argon2 from 'argon2';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type { PrismaService } from '../database/prisma.service.js';
import type { SocketRegistryService } from '../realtime/socket-registry.service.js';
import { UsersService } from './users.service.js';

const CURRENT = 'current-password';
const NEW = 'new-password-123';

function createPrismaMock() {
  return {
    user: { findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn() },
  };
}

describe('UsersService.changePassword', () => {
  let currentHash: string;
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: UsersService;

  beforeAll(async () => {
    currentHash = await argon2.hash(CURRENT);
  });

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new UsersService(
      prisma as unknown as PrismaService,
      { isOnline: vi.fn() } as unknown as SocketRegistryService
    );
  });

  it('stores a new argon2 hash when the current password is valid', async () => {
    prisma.user.findUnique.mockResolvedValue({ password: currentHash });
    prisma.user.update.mockResolvedValue({ id: 1 });

    await expect(
      service.changePassword(1, { currentPassword: CURRENT, newPassword: NEW })
    ).resolves.toEqual({ message: 'Password updated' });

    const args = prisma.user.update.mock.calls[0][0] as {
      data: { password: string };
    };
    expect(args.data.password).not.toBe(NEW);
    await expect(argon2.verify(args.data.password, NEW)).resolves.toBe(true);
  });

  it('rejects a wrong current password with 400', async () => {
    prisma.user.findUnique.mockResolvedValue({ password: currentHash });

    await expect(
      service.changePassword(1, { currentPassword: 'wrong', newPassword: NEW })
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('rejects Google-only accounts with 403', async () => {
    prisma.user.findUnique.mockResolvedValue({ password: null });

    await expect(
      service.changePassword(1, { currentPassword: CURRENT, newPassword: NEW })
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('rejects a new password equal to the current one', async () => {
    prisma.user.findUnique.mockResolvedValue({ password: currentHash });

    await expect(
      service.changePassword(1, {
        currentPassword: CURRENT,
        newPassword: CURRENT,
      })
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('returns 404 when the user does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.changePassword(1, { currentPassword: CURRENT, newPassword: NEW })
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});

describe('UsersService.updatePrivate (username rules)', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: UsersService;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new UsersService(
      prisma as unknown as PrismaService,
      { isOnline: vi.fn() } as unknown as SocketRegistryService
    );
  });

  it('rejects usernames with spaces', async () => {
    await expect(
      service.updatePrivate(1, { username: 'john doe' })
    ).resolves.toEqual({ outcome: 'invalid_username' });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('checks username uniqueness case-insensitively', async () => {
    prisma.user.findFirst.mockResolvedValue({ id: 2 });

    await expect(
      service.updatePrivate(1, { username: 'BRIVERA' })
    ).resolves.toEqual({ outcome: 'username_taken' });
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        username: { equals: 'BRIVERA', mode: 'insensitive' },
        NOT: { id: 1 },
      },
      select: { id: true },
    });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});

const PRIVATE_ROW = {
  id: 1,
  username: 'brivera',
  xp: 0,
  isOnline: false,
  avatarUrl: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  email: 'new@example.com',
  twoFaEnabled: false,
  oauthProvider: null,
  password: 'stored-hash',
};

describe('UsersService.updatePrivate (email change)', () => {
  let currentHash: string;
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: UsersService;

  beforeAll(async () => {
    currentHash = await argon2.hash(CURRENT);
  });

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new UsersService(
      prisma as unknown as PrismaService,
      { isOnline: vi.fn() } as unknown as SocketRegistryService
    );
  });

  it('changes the email when the current password is valid', async () => {
    prisma.user.findUnique.mockResolvedValue({
      email: 'old@example.com',
      password: currentHash,
    });
    prisma.user.update.mockResolvedValue(PRIVATE_ROW);

    const result = await service.updatePrivate(1, {
      email: 'new@example.com',
      currentPassword: CURRENT,
    });

    expect(result.outcome).toBe('updated');
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { email: 'new@example.com' } })
    );
  });

  it('rejects an email change with a wrong password with 400', async () => {
    prisma.user.findUnique.mockResolvedValue({
      email: 'old@example.com',
      password: currentHash,
    });

    await expect(
      service.updatePrivate(1, {
        email: 'new@example.com',
        currentPassword: NEW,
      })
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('rejects an email change without a password with 400', async () => {
    prisma.user.findUnique.mockResolvedValue({
      email: 'old@example.com',
      password: currentHash,
    });

    await expect(
      service.updatePrivate(1, { email: 'new@example.com' })
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('rejects an email change on a Google-only account with 403', async () => {
    prisma.user.findUnique.mockResolvedValue({
      email: 'old@example.com',
      password: null,
    });

    await expect(
      service.updatePrivate(1, { email: 'new@example.com' })
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('does not require a password when the email does not change', async () => {
    prisma.user.findUnique.mockResolvedValue({
      email: 'new@example.com',
      password: currentHash,
    });
    prisma.user.update.mockResolvedValue(PRIVATE_ROW);

    const result = await service.updatePrivate(1, { email: 'new@example.com' });

    expect(result.outcome).toBe('updated');
  });

  it('does not require a password for username-only updates', async () => {
    prisma.user.update.mockResolvedValue({
      ...PRIVATE_ROW,
      username: 'new_name',
    });

    const result = await service.updatePrivate(1, { username: 'new_name' });

    expect(result.outcome).toBe('updated');
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });
});
