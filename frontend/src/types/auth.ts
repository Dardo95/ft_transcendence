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

import type { User } from "./user";

export interface AuthCredentials {
	email: string;
	password: string;
	username?: string;
}

export interface AuthResponse {
	message?: string;
	user?: User;
}
