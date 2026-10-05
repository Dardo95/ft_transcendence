const API_BASE_URL = "/api";

interface FetchOptions extends RequestInit {
    body?: any;
}

/**
 * Función centralizada para realizar peticiones HTTP a la API.
 */
export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { body, ...customConfig } = options;

    // Obtener token guardado si existe (útil para peticiones autenticadas)
    const token = localStorage.getItem("authToken");

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const config: RequestInit = {
        method: options.method || "GET",
        ...customConfig,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Intentamos parsear la respuesta JSON
    let data;
    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        // Lanzamos el mensaje del backend o un mensaje genérico
        throw new Error(data.message || `Error ${response.status}: Ocurrió un problema en la petición.`);
    }

    return data as T;
}