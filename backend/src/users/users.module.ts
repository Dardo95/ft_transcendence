import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module.js';
import { ChatModule } from '../chat/chat.module.js';
import { GameModule } from '../game/game.module.js';
import { RealtimeModule } from '../realtime/realtime.module.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { FriendshipsService } from './friendships.service.js';

@Module({
  imports: [PrismaModule, ChatModule, GameModule, RealtimeModule],
  controllers: [UsersController],
  providers: [UsersService, FriendshipsService],
})
export class UsersModule {}
