import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(PrismaService.name);
  	private readonly slowQueryMs = 200;

  	constructor() {
  	  super({ log: [{ emit: 'event', level: 'query' }] });
  	  (this.$on as any)('query', (e: { query: string; duration: number }) => {
  	    if (e.duration > this.slowQueryMs) {
  	      this.logger.warn(`Slow query ${e.duration}ms: ${e.query.slice(0, 120)}`);
  	    }
  	  });
  	}
	async onModuleInit()
	{
		await this.$connect();
	}

	async onModuleDestroy()
	{
		await this.$disconnect();
	}
	 async enableShutdownHooks(app: { close: () => Promise<void> }) {
    process.once('SIGTERM', async () => {
      await app.close();
    });
    process.once('SIGINT', async () => {
      await app.close();
    });
  }

  	async ping(): Promise<{ ok: boolean; latencyMs: number }> {
  	  const start = Date.now();
  	  try {
  	    await this.$queryRaw`SELECT 1`;
  	    return { ok: true, latencyMs: Date.now() - start };
  	  } catch {
  	    return { ok: false, latencyMs: Date.now() - start };
  	  }
  	}
}