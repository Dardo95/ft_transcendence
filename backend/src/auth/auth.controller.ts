import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	Res,
	HttpCode,
  	HttpStatus,
	UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(
		@Body() data: RegisterDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const token = await this.authService.register(data);

		res.cookie('access_token', token, {
			httpOnly: false,
			secure: false,
			sameSite: 'strict',
			maxAge: 24 * 60 * 60 * 1000 //d m s ms
		});

		return {
			message: 'Registration successful',
		};
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(
		@Body() data: LoginDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const token = await this.authService.login(data);

		res.cookie('access_token', token, {
			httpOnly: false,
			secure: false,
			sameSite: 'strict',
			maxAge: 24 * 60 * 60 * 1000 //h m s ms
		});

		return {
			message: 'Login successful',
		};
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	logout(@Res({ passthrough: true }) res: Response) {
  		res.clearCookie('access_token');

  		return {
    	message: 'Logout successful',
  		};
	}

	@Get('google')
	googleLogin(@Res() res: Response) {
		const params = new URLSearchParams({
			client_id: process.env.GOOGLE_CLIENT_ID!,
			redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
			response_type: 'code',
			scope: 'openid email profile',
		});
		const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
		return res.redirect(googleUrl);
	}

	@Get('google/callback')
	async googleCallback(
  		@Query('code') code: string,
  		@Res({ passthrough: true }) res: Response,
	) {
		const token = await this.authService.googleLogin(code);

		res.cookie('access_token', token, {
			httpOnly: false,
			secure: false,
			sameSite: 'strict',
			maxAge: 24 * 60 * 60 * 1000,
		});

		return { message: 'Google login successful'};
	}
}