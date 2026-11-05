import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';
import { PrismaService } from './database/prisma.service.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const prisma = app.get(PrismaService);
  await prisma.enableShutdownHooks(app);
  app.enableShutdownHooks();
  app.setGlobalPrefix('api');

  app.use(cookieParser());
  const uploadsDir = join(process.cwd(), 'uploads');
  mkdirSync(join(uploadsDir, 'avatars'), { recursive: true });

  app.useStaticAssets(uploadsDir, { prefix: '/api/uploads/' });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transform json object into a dto
      whitelist: true, // delete fields that don't exist in dto
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(process.env.PORT || 3000);
}
await bootstrap();
