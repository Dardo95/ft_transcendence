import { apiFetch } from "./api";
import type { AuthCredentials, AuthResponse } from "../types/auth";

// Envía la petición de registro de un nuevo usuario.
export async function registerUser(
	credentials: AuthCredentials,
): Promise<AuthResponse> {
	return apiFetch<AuthResponse>("/auth/register", {
		method: "POST",
		body: credentials,
	});
}

// Envía la petición de inicio de sesión de un usuario existente.
export async function loginUser(
	credentials: AuthCredentials,
): Promise<AuthResponse> {
	return apiFetch<AuthResponse>("/auth/login", {
		method: "POST",
		body: credentials,
	});
}

export async function logoutUser(): Promise<void> {
	await apiFetch<{ message: string }>("/auth/logout", {
		method: "POST",
	});
}
