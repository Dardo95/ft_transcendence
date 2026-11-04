import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../database/prisma.module.js';
import { GameGateway } from './game.gateway.js';
import { RealtimeModule } from '../realtime/realtime.module.js';

@Module({
  imports: [AuthModule, PrismaModule, RealtimeModule],
  providers: [GameGateway],
})
export class GameModule {}
