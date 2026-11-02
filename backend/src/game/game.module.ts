import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { LobbyModule } from '../lobby/lobby.module.js';
import { GameGateway } from './game.gateway.js';
import { MapRegistryService } from './maps/map-registry.service.js';
import { MatchmakingService } from './matchmaking/matchmaking.service.js';
import { GameManagerService } from './sessions/game-manager.service.js';

@Module({
  imports: [AuthModule, LobbyModule],
  providers: [
    GameManagerService,
    MapRegistryService,
    MatchmakingService,
    GameGateway,
  ],
  exports: [
    GameManagerService,
    MapRegistryService,
    MatchmakingService,
  ],
})
export class GameModule {}