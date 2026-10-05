import {
	Body,
	Controller,
	Post,
	Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

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
	async login(
		@Body() data: LoginDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const token = await this.authService.login(data);

		res.cookie('access_token', token, {
			httpOnly: false,
			secure: false,
			sameSite: 'strict',
			maxAge: 24 * 60 * 60 * 1000 //d m s ms
		});

		return {
			message: 'Login successful',
		};
	}

	
}