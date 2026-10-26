import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getFrontendUrl(): string {
    return process.env.NODE_ENV === 'development'
      ? 'http://localhost:5173'
      : 'https://localhost:8443';
  }

  @Post('register')
  async register(
    @Body() data: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = await this.authService.register(data);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Registration successful',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = await this.authService.login(data);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Login successful',
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      path: '/',
    });

    return {
      message: 'Logout successful',
    };
  }

  @Get('google')
  googleLogin(@Req() req: Request, @Res() res: Response) {
    const frontendUrl = this.getFrontendUrl();
    const callbackUrl = `${frontendUrl}/api/auth/google/callback`;

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: callbackUrl,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    return res.redirect(googleUrl);
  }

  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const frontendUrl = this.getFrontendUrl();
    const callbackUrl = `${frontendUrl}/api/auth/google/callback`;

    const token = await this.authService.googleLogin(code, callbackUrl);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    return res.redirect(`${frontendUrl}/lobby`);
  }
}
