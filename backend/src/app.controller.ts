import { Controller, Get, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service.js';
import { PrismaService } from './database/prisma.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly prisma: PrismaService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/user')
  async getUser(): Promise<string> {
    const a = await this.prisma.user.findFirst();
    if (a)
      return a.username;
    throw new NotFoundException("User not found");
  }
}
