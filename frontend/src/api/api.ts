/**
 * HTTP API client.
 * Category: API Client
 *
 * Responsible for:
 * - Sending HTTP requests to the backend.
 * - Configuring common request options.
 * - Handling common HTTP responses and errors.
 * - Providing a typed interface for API requests.
 *
 * Does not:
 * - Contain feature-specific business logic.
 * - Manage React state.
 * - Render UI.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Ensure the endpoint starts with a slash and construct the full URL
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = API_BASE_URL.endsWith('/')
    ? `${API_BASE_URL.slice(0, -1)}${cleanEndpoint}`
    : `${API_BASE_URL}${cleanEndpoint}`;

  const response = await fetch(url, config);

  if (response.status === 401) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      (Array.isArray(errorBody.message)
        ? errorBody.message[0]
        : errorBody.message) || 'Unauthorized';

    throw new ApiError(message, 401);
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || `Server error: ${response.status}`;
    throw new ApiError(message, response.status);
  }

  // Handle 204 No Content responses gracefully
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
