import type { PrismaService } from '../database/prisma.service.js';
import type { GameManagerService } from '../game/sessions/game-manager.service.js';
import type { SocketRegistryService } from '../realtime/socket-registry.service.js';
import { FriendshipsService } from './friendships.service.js';

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
