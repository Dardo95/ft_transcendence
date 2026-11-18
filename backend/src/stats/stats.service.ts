
import { Injectable, NotFoundException } from '@nestjs/common';
import { MatchStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { MatchHistoryQueryDto } from './dto/match-history-query.dto.js';

export type MatchPlayerResult = 'WIN' | 'LOSS' | 'DRAW';

export interface UserStats {
  userId: number;
  username: string;
  matches: number;
  wins: number;
  losses: number;
  draws: number;
  kills: number;
  score: number;
  winRate: number;
  xp: number;
}

export interface MatchHistoryPlayer {
  username: string;
  result: MatchPlayerResult;
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
  result: MatchPlayerResult;
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

interface PlayerResultSource {
  result: MatchPlayerResult | null;
  isWinner: boolean;
}

/**
 * Resuelve el resultado individual.
 *
 * Los registros antiguos no tienen `result`, por lo que
 * se interpretan usando el campo heredado `isWinner`.
 */
function resolvePlayerResult(
  player: PlayerResultSource
): MatchPlayerResult {
  if (player.result !== null) {
    return player.result;
  }

  return player.isWinner ? 'WIN' : 'LOSS';
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
              result: true,
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

        const ownResult = own
          ? resolvePlayerResult(own)
          : 'LOSS';

        return {
          matchId: match.id,
          gameMode: match.gameMode,
          mapId: match.mapId,
          createdAt: match.createdAt,
          finishedAt: match.finishedAt,
          result: ownResult,
          score: own?.score ?? 0,
          kills: own?.kills ?? 0,
          position: own?.position ?? null,
          players: match.players.map((player) => {
            const result = resolvePlayerResult(player);

            return {
              username: player.user.username,
              result,
              isWinner: result === 'WIN',
              score: player.score,
              kills: player.kills,
              position: player.position,
            };
          }),
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
      select: {
        score: true,
        kills: true,
        result: true,
        isWinner: true,
      },
    });

    const results = players.map(resolvePlayerResult);

    const matches = results.length;
    const wins = results.filter((result) => result === 'WIN').length;
    const losses = results.filter((result) => result === 'LOSS').length;
    const draws = results.filter((result) => result === 'DRAW').length;

    return {
      userId: user.id,
      username: user.username,
      matches,
      wins,
      losses,
      draws,
      kills: players.reduce((sum, player) => sum + player.kills, 0),
      score: players.reduce((sum, player) => sum + player.score, 0),
      winRate: matches === 0 ? 0 : Math.round((wins / matches) * 100) / 100,
      xp: user.xp,
    };
  }
}
