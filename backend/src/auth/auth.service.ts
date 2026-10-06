import {
  ConflictException, Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService) {}

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
      const user = await this.prisma.user.create({
        data: {
          email,
          username,
          password: passwordHash,
        },
        select: {
          id: true,
          username: true,
          password: true,
          email: true,
          xp: true,
          createdAt: true,
        },
      });
      return this.login( {email: email, password: data.password} );

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

  async login(data: LoginDto) {
    const email = data.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      throw new UnauthorizedException('Invalid credentials');

    if (!user.password)
      throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await argon2.verify(user.password, data.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return this.sign({ id: user.id, username: user.username })
  }

  private sign(user: { id: number; username: string; }) {
    const payload = {
      sub: user.id,
      username: user.username
    };
    return this.jwtService.sign(payload);
  }

}