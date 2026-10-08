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
