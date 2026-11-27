import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  type HttpErrorBody,
  INTERNAL_ERROR_MESSAGE,
  toErrorMessage,
} from '../errors/error-body.js';

/**
 * Global HTTP filter (AUTH-B-14): every error answers
 * `{ statusCode, error, message }`, with `message` always a string.
 * Unexpected errors are logged and never leak their details.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      throw exception;
    }

    const response = host.switchToHttp().getResponse<Response>();
    const body = this.toBody(exception);

    response.status(body.statusCode).json(body);
  }

  private toBody(exception: unknown): HttpErrorBody {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const payload = exception.getResponse();

      return {
        statusCode,
        error: this.errorName(statusCode, payload),
        message: toErrorMessage(payload, exception.message),
      };
    }

    this.logger.error(
      'Unhandled HTTP exception',
      exception instanceof Error ? exception.stack : String(exception)
    );

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: INTERNAL_ERROR_MESSAGE,
    };
  }

  private errorName(statusCode: number, payload: unknown): string {
    if (
      typeof payload === 'object' &&
      payload !== null &&
      'error' in payload &&
      typeof (payload as { error: unknown }).error === 'string'
    ) {
      return (payload as { error: string }).error;
    }

    const name = HttpStatus[statusCode];
    if (typeof name !== 'string') {
      return 'Error';
    }

    // BAD_REQUEST -> Bad Request
    return name
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
