import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ChatModule } from './chat/chat.module.js';
import { GameModule } from './game/game.module.js';

@Module({
  imports: [HealthModule, UsersModule, AuthModule, ChatModule, GameModule],
})
export class AppModule {}
