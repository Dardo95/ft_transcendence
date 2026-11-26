import {
  type ArgumentsHost,
  Catch,
  HttpException,
  Logger,
} from '@nestjs/common';
import { WsException, type WsExceptionFilter } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import {
  INTERNAL_ERROR_MESSAGE,
  type SocketErrorBody,
  toErrorMessage,
} from '../errors/error-body.js';

/**
 * WebSocket filter (AUTH-B-14) for the /chat and /game gateways.
 * Any error thrown in a handler reaches the client as the `exception`
 * event with `{ status: 'error', event, message }`. `event` tells the
 * client which message failed. Unexpected errors are logged and sent
 * as a generic message.
 */
@Catch()
export class WsExceptionsFilter implements WsExceptionFilter {
  private readonly logger = new Logger(WsExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ws = host.switchToWs();
    const client = ws.getClient<Socket>();

    const body: SocketErrorBody = {
      status: 'error',
      event: ws.getPattern(),
      message: this.toMessage(exception),
    };

    client.emit('exception', body);
  }

  private toMessage(exception: unknown): string {
    if (exception instanceof WsException) {
      return toErrorMessage(exception.getError(), INTERNAL_ERROR_MESSAGE);
    }

    if (exception instanceof HttpException) {
      return toErrorMessage(exception.getResponse(), exception.message);
    }

    this.logger.error(
      'Unhandled WebSocket exception',
      exception instanceof Error ? exception.stack : String(exception)
    );

    return INTERNAL_ERROR_MESSAGE;
  }
}
