import { Module } from '@nestjs/common';

import { GameManagerService } from './sessions/game-manager.service.js';

@Module({
  providers: [GameManagerService],
  exports: [GameManagerService],
})
export class GameModule {}
