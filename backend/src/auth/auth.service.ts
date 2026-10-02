import {
  ConflictException, Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: RegisterDto) {
    const email = data.email.trim().toLowerCase();
    const username = data.username.trim();

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username },],
      },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Email or username already in use');
    }

    const passwordHash = await argon2.hash(data.password);

    try {
      return await this.prisma.user.create({
        data: {
          email,
          username,
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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email or username already in use');
      }
      throw error;
    }
  }
}
