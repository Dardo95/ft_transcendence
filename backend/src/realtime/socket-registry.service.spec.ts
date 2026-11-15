import type { Socket } from 'socket.io';
import { SocketRegistryService } from './socket-registry.service.js';

function fakeSocket(id: string, userId: number, username: string) {
  return {
    id,
    data: { user: { id: userId, username } },
    emit: vi.fn(),
    disconnect: vi.fn(),
  } as unknown as Socket;
}

describe('SocketRegistryService.renameUser', () => {
  it('updates the username on every live socket of the user', () => {
    const registry = new SocketRegistryService();
    const chat = fakeSocket('s1', 1, 'old_name');
    const game = fakeSocket('s2', 1, 'old_name');
    const other = fakeSocket('s3', 2, 'someone');
    registry.register('chat', 1, chat);
    registry.register('game', 1, game);
    registry.register('chat', 2, other);

    registry.renameUser(1, 'new_name');

    expect(chat.data.user).toEqual({ id: 1, username: 'new_name' });
    expect(game.data.user).toEqual({ id: 1, username: 'new_name' });
    expect(other.data.user).toEqual({ id: 2, username: 'someone' });
  });

  it('does nothing when the user has no live sockets', () => {
    const registry = new SocketRegistryService();

    expect(() => registry.renameUser(1, 'new_name')).not.toThrow();
  });
});
