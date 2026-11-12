import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../database/prisma.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { WsJwtAuthService } from './ws-jwt-auth.service.js';

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  const isPlaceholder = !secret || secret.startsWith('changeme');

  if (isPlaceholder && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set to a random value in production');
  }

  return secret || 'dev_only_change_me';
}

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: resolveJwtSecret(),
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, WsJwtAuthService],
  exports: [JwtModule, WsJwtAuthService],
})
export class AuthModule {}
