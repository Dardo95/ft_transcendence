import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { FriendshipsService } from './friendships.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, FriendshipsService],
})
export class UsersModule {}
