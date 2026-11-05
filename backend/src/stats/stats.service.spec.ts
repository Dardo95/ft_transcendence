import { NotFoundException } from '@nestjs/common';
import { MatchStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { StatsService } from './stats.service.js';

function createPrismaMock() {
  return {
    user: { findUnique: vi.fn() },
    matchPlayer: { findMany: vi.fn() },
    match: { count: vi.fn(), findMany: vi.fn() },
  };
}

type PrismaMock = ReturnType<typeof createPrismaMock>;

describe('StatsService', () => {
  let prisma: PrismaMock;
  let service: StatsService;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new StatsService(prisma as unknown as PrismaService);
  });

  describe('getByUserId', () => {
    it('throws when the user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getByUserId(99)).rejects.toBeInstanceOf(
        NotFoundException
      );
    });

    it('aggregates finished matches', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        username: 'brivera',
        xp: 0,
      });
      prisma.matchPlayer.findMany.mockResolvedValue([
        { score: 120, kills: 5, isWinner: true },
        { score: 100, kills: 4, isWinner: true },
        { score: 90, kills: 4, isWinner: false },
        { score: 80, kills: 2, isWinner: false },
      ]);

      await expect(service.getByUserId(1)).resolves.toEqual({
        userId: 1,
        username: 'brivera',
        matches: 4,
        wins: 2,
        losses: 2,
        kills: 15,
        score: 390,
        winRate: 0.5,
        xp: 0,
      });

      expect(prisma.matchPlayer.findMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          match: { status: MatchStatus.FINISHED },
        },
        select: { score: true, kills: true, isWinner: true },
      });
    });

    it('returns a zero win rate when there are no matches', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 6,
        username: 'nsantand',
        xp: 0,
      });
      prisma.matchPlayer.findMany.mockResolvedValue([]);

      await expect(service.getByUserId(6)).resolves.toMatchObject({
        matches: 0,
        wins: 0,
        losses: 0,
        kills: 0,
        score: 0,
        winRate: 0,
      });
    });
  });

  describe('getByUsername', () => {
    it('looks the user up by username and throws when missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getByUsername('ghost')).rejects.toBeInstanceOf(
        NotFoundException
      );
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'ghost' },
        select: { id: true, username: true, xp: true },
      });
    });
  });

  describe('getMatches', () => {
    it('paginates and maps the current user perspective', async () => {
      const finishedAt = new Date('2026-10-22T18:00:00.000Z');
      prisma.match.count.mockResolvedValue(4);
      prisma.match.findMany.mockResolvedValue([
        {
          id: 3,
          gameMode: 'CLASSIC',
          mapId: 'map3',
          createdAt: finishedAt,
          finishedAt,
          players: [
            {
              userId: 2,
              score: 120,
              kills: 6,
              position: 1,
              isWinner: true,
              user: { username: 'ozamora-' },
            },
            {
              userId: 1,
              score: 90,
              kills: 4,
              position: 2,
              isWinner: false,
              user: { username: 'brivera' },
            },
          ],
        },
      ]);

      await expect(
        service.getMatches(1, { page: 2, limit: 5 })
      ).resolves.toEqual({
        data: [
          {
            matchId: 3,
            gameMode: 'CLASSIC',
            mapId: 'map3',
            createdAt: finishedAt,
            finishedAt,
            result: 'LOSS',
            score: 90,
            kills: 4,
            position: 2,
            players: [
              {
                username: 'ozamora-',
                isWinner: true,
                score: 120,
                kills: 6,
                position: 1,
              },
              {
                username: 'brivera',
                isWinner: false,
                score: 90,
                kills: 4,
                position: 2,
              },
            ],
          },
        ],
        total: 4,
        page: 2,
        limit: 5,
      });

      expect(prisma.match.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: MatchStatus.FINISHED,
            players: { some: { userId: 1 } },
          },
          skip: 5,
          take: 5,
        })
      );
    });

    it('uses page 1 and limit 10 by default', async () => {
      prisma.match.count.mockResolvedValue(0);
      prisma.match.findMany.mockResolvedValue([]);

      await expect(service.getMatches(1, {})).resolves.toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      expect(prisma.match.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 })
      );
    });
  });
});
