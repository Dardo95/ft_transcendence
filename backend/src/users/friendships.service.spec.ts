import type { PrismaService } from '../database/prisma.service.js';
import type { GameManagerService } from '../game/sessions/game-manager.service.js';
import type { SocketRegistryService } from '../realtime/socket-registry.service.js';
import { FriendshipsService } from './friendships.service.js';
import { Prisma } from '@prisma/client';

const ME = {
  id: 1,
  username: 'brivera',
  xp: 0,
  isOnline: true,
  avatarUrl: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

function friend(id: number, username: string) {
  return {
    id,
    username,
    xp: 0,
    isOnline: false,
    avatarUrl: null,
    createdAt: new Date('2026-01-02T00:00:00.000Z'),
  };
}

function createPrismaMock() {
  return {
    friendship: { findMany: vi.fn() },
  };
}

function createService(
  prisma: ReturnType<typeof createPrismaMock>,
  gameManager: { getActiveGameIdForUser: ReturnType<typeof vi.fn> },
  registry: { isOnline: ReturnType<typeof vi.fn> }
) {
  return new FriendshipsService(
    prisma as unknown as PrismaService,
    gameManager as unknown as GameManagerService,
    registry as unknown as SocketRegistryService
  );
}

describe('FriendshipsService.listFriends', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let gameManager: { getActiveGameIdForUser: ReturnType<typeof vi.fn> };
  let registry: { isOnline: ReturnType<typeof vi.fn> };
  let service: FriendshipsService;

  beforeEach(() => {
    prisma = createPrismaMock();
    gameManager = { getActiveGameIdForUser: vi.fn().mockReturnValue(null) };
    registry = { isOnline: vi.fn().mockReturnValue(false) };
    service = createService(prisma, gameManager, registry);
  });

  it('marks a friend with a live game session as in_game', async () => {
    const other = friend(2, 'ozamora-');
    prisma.friendship.findMany.mockResolvedValue([
      {
        requesterId: ME.id,
        addresseeId: other.id,
        requester: ME,
        addressee: other,
      },
    ]);
    gameManager.getActiveGameIdForUser.mockImplementation((userId: number) =>
      userId === other.id ? 'game-uuid' : null
    );
    registry.isOnline.mockReturnValue(true);

    const [result] = await service.listFriends(ME.id);

    expect(result.status).toBe('in_game');
    expect(result.currentGameId).toBe('game-uuid');
    expect(result.username).toBe(other.username);
  });

  it('uses the socket registry to report online users', async () => {
    const other = friend(2, 'ozamora-');
    prisma.friendship.findMany.mockResolvedValue([
      {
        requesterId: other.id,
        addresseeId: ME.id,
        requester: other,
        addressee: ME,
      },
    ]);
    registry.isOnline.mockImplementation(
      (namespace: string, userId: number) =>
        namespace === 'chat' && userId === other.id
    );

    const [result] = await service.listFriends(ME.id);

    expect(result.status).toBe('online');
    expect(result.currentGameId).toBeNull();
  });

  it('reports offline when there is no socket and no active game', async () => {
    const other = friend(2, 'ozamora-');
    prisma.friendship.findMany.mockResolvedValue([
      {
        requesterId: ME.id,
        addresseeId: other.id,
        requester: ME,
        addressee: other,
      },
    ]);

    const [result] = await service.listFriends(ME.id);

    expect(result.status).toBe('offline');
    expect(result.currentGameId).toBeNull();
    expect(registry.isOnline).toHaveBeenCalledWith('chat', other.id);
  });
});

describe('FriendshipsService.listBlocked', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: FriendshipsService;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = createService(
      prisma,
      { getActiveGameIdForUser: vi.fn().mockReturnValue(null) },
      { isOnline: vi.fn().mockReturnValue(false) }
    );
  });

  it('only queries blocks created by the current user, newest first', async () => {
    prisma.friendship.findMany.mockResolvedValue([]);

    await service.listBlocked(ME.id);

    expect(prisma.friendship.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { requesterId: ME.id, status: 'BLOCKED' },
        orderBy: { createdAt: 'desc' },
      })
    );
  });

  it('maps the blocked user to the public contract', async () => {
    const other = friend(2, 'ozamora-');
    const blockedAt = new Date('2026-02-01T00:00:00.000Z');
    prisma.friendship.findMany.mockResolvedValue([
      {
        id: 10,
        requesterId: ME.id,
        addresseeId: other.id,
        status: 'BLOCKED',
        createdAt: blockedAt,
        addressee: other,
      },
    ]);

    const [result] = await service.listBlocked(ME.id);

    expect(result).toEqual({
      id: 10,
      createdAt: blockedAt.toISOString(),
      user: {
        id: other.id,
        username: other.username,
        xp: other.xp,
        isOnline: other.isOnline,
        avatarUrl: other.avatarUrl,
        createdAt: other.createdAt.toISOString(),
      },
    });
    expect(result.user).not.toHaveProperty('email');
  });

  it('returns an empty list when the user has no blocks', async () => {
    prisma.friendship.findMany.mockResolvedValue([]);

    await expect(service.listBlocked(ME.id)).resolves.toEqual([]);
  });
});

describe('FriendshipsService.request', () => {
  const OTHER = { id: 2, username: 'raul' };

  function createRequestPrisma(existing: unknown) {
    const tx = {
      friendship: {
        findFirst: vi.fn().mockResolvedValue(existing),
        update: vi
          .fn()
          .mockImplementation(({ where, data }) =>
            Promise.resolve({ ...(existing as object), id: where.id, ...data })
          ),
        create: vi
          .fn()
          .mockImplementation(({ data }) =>
            Promise.resolve({ id: 99, status: 'PENDING', ...data })
          ),
      },
    };
    const prisma = {
      user: { findUnique: vi.fn().mockResolvedValue(OTHER) },
      $transaction: vi.fn((fn: (client: typeof tx) => unknown) => fn(tx)),
    };
    return { prisma, tx };
  }

  function createRequestService(prisma: unknown) {
    return new FriendshipsService(
      prisma as PrismaService,
      {} as GameManagerService,
      {} as SocketRegistryService
    );
  }

  it('accepts a pending reverse request instead of creating a second row', async () => {
    const { prisma, tx } = createRequestPrisma({
      id: 7,
      requesterId: OTHER.id,
      addresseeId: ME.id,
      status: 'PENDING',
    });

    const result = await createRequestService(prisma).request(
      ME.id,
      OTHER.username
    );

    expect(result).toMatchObject({
      outcome: 'accepted',
      id: 7,
      status: 'ACCEPTED',
    });
    expect(tx.friendship.create).not.toHaveBeenCalled();
  });

  it('keeps already_exists when my own request is still pending', async () => {
    const { prisma, tx } = createRequestPrisma({
      id: 7,
      requesterId: ME.id,
      addresseeId: OTHER.id,
      status: 'PENDING',
    });

    const result = await createRequestService(prisma).request(
      ME.id,
      OTHER.username
    );

    expect(result).toEqual({ outcome: 'already_exists', status: 'PENDING' });
    expect(tx.friendship.update).not.toHaveBeenCalled();
  });

  it('retries once when the serializable transaction collides', async () => {
    const { prisma } = createRequestPrisma(null);
    const conflict = new Prisma.PrismaClientKnownRequestError('conflict', {
      code: 'P2034',
      clientVersion: 'test',
    });
    const realTransaction = prisma.$transaction.getMockImplementation()!;
    prisma.$transaction
      .mockRejectedValueOnce(conflict)
      .mockImplementation(realTransaction);

    const result = await createRequestService(prisma).request(
      ME.id,
      OTHER.username
    );

    expect(result).toMatchObject({ outcome: 'created' });
    expect(prisma.$transaction).toHaveBeenCalledTimes(2);
  });
});
