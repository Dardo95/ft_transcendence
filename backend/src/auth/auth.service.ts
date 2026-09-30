import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../database/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username },
        ],
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Email or username already in use',
      );
    }

    const passwordHash = await argon2.hash(data.password);

    return this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        xp: true,
        createdAt: true,
      },
    });
  }
}
