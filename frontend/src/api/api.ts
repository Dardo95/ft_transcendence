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
			data.message ||
				`Error ${response.status}: Ocurrió un problema en la petición.`,
		);
	}

	return data as T;
}
