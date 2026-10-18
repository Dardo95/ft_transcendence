import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { ChatGateway } from './chat.gateway.js';

@Module({
  imports: [AuthModule],
  providers: [ChatGateway],
})
export class ChatModule {}