import {
  type ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter.js';

function createHost() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  const host = {
    getType: () => 'http',
    switchToHttp: () => ({ getResponse: () => ({ status }) }),
  } as unknown as ArgumentsHost;

  return { host, status, json };
}

describe('HttpExceptionFilter', () => {
  const filter = new HttpExceptionFilter();

  beforeEach(() => {
    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps the status and message of an HttpException', () => {
    const { host, status, json } = createHost();

    filter.catch(new NotFoundException('User not found'), host);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({
      statusCode: 404,
      error: 'Not Found',
      message: 'User not found',
    });
  });

  it('joins ValidationPipe message arrays into one string', () => {
    const { host, json } = createHost();

    filter.catch(
      new BadRequestException([
        'email must be an email',
        'password is too weak',
      ]),
      host
    );

    expect(json).toHaveBeenCalledWith({
      statusCode: 400,
      error: 'Bad Request',
      message: 'email must be an email; password is too weak',
    });
  });

  it('derives the error name from the status when the payload has none', () => {
    const { host, json } = createHost();

    filter.catch(
      new HttpException('Slow down', HttpStatus.TOO_MANY_REQUESTS),
      host
    );

    expect(json).toHaveBeenCalledWith({
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'Slow down',
    });
  });

  it('hides unexpected errors behind a generic 500', () => {
    const { host, status, json } = createHost();

    filter.catch(new Error('database password is wrong'), host);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Internal server error',
    });
    expect(Logger.prototype.error).toHaveBeenCalled();
  });
});
