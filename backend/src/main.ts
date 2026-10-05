import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,  // Transform json object into a dto
      whitelist: true,  // delete fields that don't exist in dto
      forbidNonWhitelisted: true
    }),
  );

  await app.listen(process.env.PORT || 3000);
}
await bootstrap();
