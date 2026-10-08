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

const API_BASE_URL = "/api";

interface FetchOptions extends Omit<RequestInit, "body"> {
	body?: unknown;
}

export async function apiFetch<T>(
	endpoint: string,
	options: FetchOptions = {},
): Promise<T> {
	const { body, ...customConfig } = options;
	const headers: HeadersInit = {
		"Content-Type": "application/json",
		...options.headers,
	};

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		method: options.method || "GET",
		credentials: "include",
		...customConfig,
		headers,
		body: body === undefined ? undefined : JSON.stringify(body),
	});

	let data: { message?: string } = {};
	try {
		data = await response.json();
	} catch {
		// Some successful endpoints do not return a response body.
	}

	if (!response.ok) {
		throw new Error(
			data.message || `Request failed with status ${response.status}.`,
		);
	}

	return data as T;
}
