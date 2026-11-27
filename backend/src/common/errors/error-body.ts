// Error shapes shared by every HTTP endpoint and every WebSocket handler.

/** Body of every HTTP error response. */
export interface HttpErrorBody {
  statusCode: number;
  error: string;
  message: string;
}

/** Payload of the `exception` event sent to a socket when a handler fails. */
export interface SocketErrorBody {
  status: 'error';
  event: string;
  message: string;
}

export const INTERNAL_ERROR_MESSAGE = 'Internal server error';

/**
 * Turns whatever an exception carries into one readable string.
 * The ValidationPipe sends an array of messages: they are joined.
 */
export function toErrorMessage(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  if (Array.isArray(value)) {
    const parts = value.filter(
      (part): part is string => typeof part === 'string' && part.trim() !== ''
    );
    if (parts.length > 0) {
      return parts.join('; ');
    }
  }

  if (typeof value === 'object' && value !== null && 'message' in value) {
    return toErrorMessage((value as { message: unknown }).message, fallback);
  }

  return fallback;
}
