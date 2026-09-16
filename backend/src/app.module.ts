import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthController } from './health/health.controller.js';

@Module({
  imports: [],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
