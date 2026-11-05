import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { MatchHistoryQueryDto } from './dto/match-history-query.dto.js';
import { StatsService } from './stats.service.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly stats: StatsService) {}

  @Get('me/stats')
  me(@CurrentUser('sub') userId: number) {
    return this.stats.getByUserId(userId);
  }

  @Get('me/matches')
  myMatches(
    @CurrentUser('sub') userId: number,
    @Query() query: MatchHistoryQueryDto
  ) {
    return this.stats.getMatches(userId, query);
  }

  @Get(':username/stats')
  byUsername(@Param('username') username: string) {
    return this.stats.getByUsername(username);
  }
}
