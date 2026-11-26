import {
  type ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { WsExceptionsFilter } from './ws-exception.filter.js';

function createHost(pattern: string) {
  const client = { emit: vi.fn() };
  const host = {
    switchToWs: () => ({
      getClient: () => client,
      getPattern: () => pattern,
    }),
  } as unknown as ArgumentsHost;

  return { host, client };
}

describe('WsExceptionsFilter', () => {
  const filter = new WsExceptionsFilter();
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends a WsException message together with the failing event', () => {
    const { host, client } = createHost('game:join');

    filter.catch(new WsException('Game not found or already finished'), host);

    expect(client.emit).toHaveBeenCalledWith('exception', {
      status: 'error',
      event: 'game:join',
      message: 'Game not found or already finished',
    });
  });

  it('reads the message of a WsException built from an object', () => {
    const { host, client } = createHost('chat:send');

    filter.catch(new WsException({ message: 'Too fast' }), host);

    expect(client.emit).toHaveBeenCalledWith('exception', {
      status: 'error',
      event: 'chat:send',
      message: 'Too fast',
    });
  });

  it('also formats HTTP exceptions thrown inside a handler', () => {
    const { host, client } = createHost('lobby:invite');

    filter.catch(new BadRequestException('Invalid payload'), host);

    expect(client.emit).toHaveBeenCalledWith('exception', {
      status: 'error',
      event: 'lobby:invite',
      message: 'Invalid payload',
    });
  });

  it('hides unexpected errors behind a generic message', () => {
    const { host, client } = createHost('game:input');

    filter.catch(new Error('undefined is not a function'), host);

    expect(client.emit).toHaveBeenCalledWith('exception', {
      status: 'error',
      event: 'game:input',
      message: 'Internal server error',
    });
    expect(errorSpy).toHaveBeenCalled();
  });
});
