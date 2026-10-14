/**
 * Authentication service.
 * Category: Service
 *
 * Responsible for:
 * - Performing login operations.
 * - Performing registration operations.
 * - Performing logout operations.
 * - Handling authentication-related API operations.
 *
 * Uses the API client to communicate with the backend.
 *
 * Does not:
 * - Render UI.
 * - Manage React component state.
 * - Contain user-facing translations.
 */

import { apiFetch } from '../../../api/api';
import type { AuthCredentials, AuthResponse } from '../types/auth';

// Sends the registration HTTP request for a new user.
export async function registerUser(
  credentials: AuthCredentials
): Promise<void> {
  await apiFetch<void>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

// Sends the login HTTP request for an existing user.
export async function loginUser(credentials: AuthCredentials): Promise<void> {
  await apiFetch<void>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

// Sends the logout HTTP request to terminate the user session.
export async function logoutUser(): Promise<void> {
  await apiFetch<void>('/auth/logout', {
    method: 'POST',
  });
}

export async function getMe(): Promise<AuthResponse> {
  return await apiFetch<AuthResponse>('/users/me', {
    method: 'GET',
  });
}
