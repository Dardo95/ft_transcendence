import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [HealthModule, UsersModule, AuthModule],
})
export class AppModule {}
