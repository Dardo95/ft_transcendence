import { apiFetch } from "./api";

export interface AuthCredentials {
    email: string;
    password: string;
    username?: string;
}

export interface AuthResponse {
    message?: string;
    token?: string;
    user?: {
        id: string;
        email: string;
        username?: string;
    };
}

/**
 * Envía la petición de registro de un nuevo usuario.
 */
export async function registerUser(credentials: AuthCredentials): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: credentials,
    });
}

/**
 * Envía la petición de inicio de sesión de un usuario existente.
 */
export async function loginUser(credentials: AuthCredentials): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: credentials,
    });
}