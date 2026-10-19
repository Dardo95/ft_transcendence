import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { ChatGateway } from './chat.gateway.js';
import { LobbyModule } from '../lobby/lobby.module.js';
import { PrismaModule } from '../database/prisma.module.js';

@Module({
  imports: [AuthModule, LobbyModule, PrismaModule],
  providers: [ChatGateway],
})
export class ChatModule {}