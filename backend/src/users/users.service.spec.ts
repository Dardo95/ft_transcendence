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
    user: { findUnique: vi.fn(), update: vi.fn() },
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
