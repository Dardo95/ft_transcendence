import { Injectable, NotFoundException } from '@nestjs/common';
import { MatchStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { MatchHistoryQueryDto } from './dto/match-history-query.dto.js';

export interface UserStats {
  userId: number;
  username: string;
  matches: number;
  wins: number;
  losses: number;
  kills: number;
  score: number;
  winRate: number;
  xp: number;
}

export interface MatchHistoryPlayer {
  username: string;
  isWinner: boolean;
  score: number;
  kills: number;
  position: number | null;
}

export interface MatchHistoryItem {
  matchId: number;
  gameMode: string;
  mapId: string | null;
  createdAt: Date;
  finishedAt: Date | null;
  result: 'WIN' | 'LOSS';
  score: number;
  kills: number;
  position: number | null;
  players: MatchHistoryPlayer[];
}

export interface MatchHistoryPage {
  data: MatchHistoryItem[];
  total: number;
  page: number;
  limit: number;
}

interface StatsUser {
  id: number;
  username: string;
  xp: number;
}

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getByUserId(userId: number): Promise<UserStats> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, xp: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.buildStats(user);
  }

  async getByUsername(username: string): Promise<UserStats> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, xp: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.buildStats(user);
  }

  async getMatches(
    userId: number,
    query: MatchHistoryQueryDto
  ): Promise<MatchHistoryPage> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = {
      status: MatchStatus.FINISHED,
      players: { some: { userId } },
    };

    const [total, matches] = await Promise.all([
      this.prisma.match.count({ where }),
      this.prisma.match.findMany({
        where,
        orderBy: [{ finishedAt: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          gameMode: true,
          mapId: true,
          createdAt: true,
          finishedAt: true,
          players: {
            orderBy: { position: 'asc' },
            select: {
              userId: true,
              score: true,
              kills: true,
              position: true,
              isWinner: true,
              user: { select: { username: true } },
            },
          },
        },
      }),
    ]);

    return {
      data: matches.map((match) => {
        const own = match.players.find((player) => player.userId === userId);

        return {
          matchId: match.id,
          gameMode: match.gameMode,
          mapId: match.mapId,
          createdAt: match.createdAt,
          finishedAt: match.finishedAt,
          result: own?.isWinner ? 'WIN' : 'LOSS',
          score: own?.score ?? 0,
          kills: own?.kills ?? 0,
          position: own?.position ?? null,
          players: match.players.map((player) => ({
            username: player.user.username,
            isWinner: player.isWinner,
            score: player.score,
            kills: player.kills,
            position: player.position,
          })),
        };
      }),
      total,
      page,
      limit,
    };
  }

  private async buildStats(user: StatsUser): Promise<UserStats> {
    const players = await this.prisma.matchPlayer.findMany({
      where: {
        userId: user.id,
        match: { status: MatchStatus.FINISHED },
      },
      select: { score: true, kills: true, isWinner: true },
    });

    const matches = players.length;
    const wins = players.filter((player) => player.isWinner).length;
    const losses = matches - wins;

    return {
      userId: user.id,
      username: user.username,
      matches,
      wins,
      losses,
      kills: players.reduce((sum, player) => sum + player.kills, 0),
      score: players.reduce((sum, player) => sum + player.score, 0),
      winRate: matches === 0 ? 0 : Math.round((wins / matches) * 100) / 100,
      xp: user.xp,
    };
  }
}
