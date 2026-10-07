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
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {

	private readonly googleClient = new OAuth2Client(
		process.env.GOOGLE_CLIENT_ID,
	);

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

	async googleLogin(code: string) {
		const response = await fetch(
			'https://oauth2.googleapis.com/token',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					code,
					client_id: process.env.GOOGLE_CLIENT_ID!,
					client_secret: process.env.GOOGLE_CLIENT_SECRET!,
					redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
					grant_type: 'authorization_code',
				}),
			},
		);

		if (!response.ok) {
			throw new UnauthorizedException('Google token exchange failed');
		}

		const tokens = await response.json();

		const ticket = await this.googleClient.verifyIdToken({
			idToken: tokens.id_token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		if (!payload?.sub || !payload.email) {
			throw new UnauthorizedException('Invalid Google account');
		}

		if (!payload.email_verified) {
			throw new UnauthorizedException(
				'Google email is not verified',
			);
		}

		const googleId = payload.sub;
		const email = payload.email.toLowerCase();

		let user = await this.prisma.user.findFirst({
			where: {
				oauthProvider: 'google',
				oauthId: googleId,
			},
		});

		if (!user) {
			user = await this.prisma.user.findUnique({
				where: {
					email,
				},
			});
		}

		if (user) {
			if (user.oauthId !== googleId) {
				user = await this.prisma.user.update({
					where: {
						id: user.id,
					},
					data: {
						oauthProvider: 'google',
						oauthId: googleId,
					},
				});
			}
		}

		if (!user) {
			let username =
				payload.name?.trim() ||
				email.split('@')[0];

			username = username.replace(/\s+/g, '_');

			const originalUsername = username;
			let suffix = 2;

			while (
				await this.prisma.user.findUnique({
					where: { username },
				})
			) {
				username = `${originalUsername}_${suffix}`;
				suffix++;
			}

			user = await this.prisma.user.create({
				data: {
					email,
					username,
					password: null,
					oauthProvider: 'google',
					oauthId: googleId,
				},
			});
		}

		return this.sign({ id: user.id, username: user.username })
	}


	/*----------utils-----------*/

	private sign(user: { id: number; username: string; }) {
		const payload = {
			sub: user.id,
			username: user.username
		};
		return this.jwtService.sign(payload);
	}
}