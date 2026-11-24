import { Controller, Get, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

import { GameManagerService } from './sessions/game-manager.service.js';

export interface ActiveGameResponse {
  gameId: string | null;
}

/**
 * Exposes the caller's current match so the lobby can block new matchmaking
 * and offer a direct way back into the game.
 */
@Controller('game')
@UseGuards(JwtAuthGuard)
export class GameController {
  constructor(private readonly gameManager: GameManagerService) {}

  @Get('active')
  getActiveGame(@CurrentUser('sub') userId: number): ActiveGameResponse {
    return {
      gameId: this.gameManager.getActiveGameIdForUser(userId),
    };
  }
}
