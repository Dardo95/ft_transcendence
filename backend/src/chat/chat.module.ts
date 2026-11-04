import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { ChatGateway } from './chat.gateway.js';
import { LobbyModule } from '../lobby/lobby.module.js';
import { PrismaModule } from '../database/prisma.module.js';
import { RealtimeModule } from '../realtime/realtime.module.js';

@Module({
  imports: [AuthModule, LobbyModule, PrismaModule, RealtimeModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
