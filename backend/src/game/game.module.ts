import { Module } from '@nestjs/common';

import { GameManagerService } from './sessions/game-manager.service.js';
import { MapRegistryService } from './maps/map-registry.service.js';

@Module({
  providers: [GameManagerService, MapRegistryService],
  exports: [GameManagerService, MapRegistryService],
})
export class GameModule {}
