import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check() {
    try {
      const db = await this.prisma.ping();
      return {
        status: db?.ok ? 'ok' : 'error',
        db: db?.ok ? 'up' : 'down',
        latencyMs: db?.latencyMs ?? 0,
      };
    } catch {
      return {
        status: 'error',
        db: 'down',
        latencyMs: -1,
      };
    }
  }
}
