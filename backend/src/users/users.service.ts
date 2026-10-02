import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        xp: true,
        createdAt: true,
      },
    });
  }

  async getUser(): Promise<string> {
    const user = await this.prisma.user.findFirst();
    if (!user) throw new NotFoundException('User not found');
    return user.username;
  }
}
