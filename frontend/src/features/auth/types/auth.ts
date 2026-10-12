/**
 * Authentication-related type definitions.
 * Category: Types
 *
 * Contains:
 * - Login credentials.
 * - Registration data.
 * - Authentication responses.
 * - Authentication-related domain types.
 *
 * This file must contain type definitions only.
 */

export interface AuthCredentials {
	email: string;
	password: string;
	username?: string;
}

export interface AuthResponse {
	user: {
		id: string;
		email: string;
		username: string;
		avatarUrl?: string;
	};
}
