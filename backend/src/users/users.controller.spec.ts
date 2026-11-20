import type { AuthService } from '../auth/auth.service.js';
import type { ChatGateway } from '../chat/chat.gateway.js';
import type { FriendshipsService } from './friendships.service.js';
import type { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';

const ME_ID = 1;
const OTHER_ID = 2;

function createController(block: ReturnType<typeof vi.fn>) {
  const emit = vi.fn();
  const to = vi.fn();
  // `emitToUser` chains `to(room).emit(event, payload)`.
  const server = { to, emit };
  to.mockReturnValue(server);

  const friendships = { block } as unknown as FriendshipsService;

  const controller = new UsersController(
    {} as UsersService,
    friendships,
    { server } as unknown as ChatGateway,
    {} as AuthService
  );

  return { controller, to, emit };
}

describe('UsersController.blockUser', () => {
  it('notifies the blocked user so their lists reload', async () => {
    const blocked = {
      id: 10,
      requesterId: ME_ID,
      addresseeId: OTHER_ID,
      status: 'BLOCKED',
      createdAt: new Date('2026-02-01T00:00:00.000Z'),
    };
    const block = vi.fn().mockResolvedValue(blocked);
    const { controller, to, emit } = createController(block);

    const result = await controller.blockUser(ME_ID, { username: 'ozamora-' });

    expect(block).toHaveBeenCalledWith(ME_ID, 'ozamora-');
    // The HTTP response body must stay unchanged for existing clients.
    expect(result).toBe(blocked);
    expect(to).toHaveBeenCalledWith(`user:${OTHER_ID}`);
    expect(emit).toHaveBeenCalledWith('friend:removed', {
      message: 'User blocked',
      requesterId: ME_ID,
      addresseeId: OTHER_ID,
    });
  });

  it('resolves the other side defensively from the returned row', async () => {
    const blocked = {
      id: 11,
      requesterId: OTHER_ID,
      addresseeId: ME_ID,
      status: 'BLOCKED',
      createdAt: new Date('2026-02-01T00:00:00.000Z'),
    };
    const { controller, to, emit } = createController(
      vi.fn().mockResolvedValue(blocked)
    );

    await controller.blockUser(ME_ID, { username: 'ozamora-' });

    expect(to).toHaveBeenCalledWith(`user:${OTHER_ID}`);
    expect(emit).toHaveBeenCalledWith('friend:removed', {
      message: 'User blocked',
      requesterId: OTHER_ID,
      addresseeId: ME_ID,
    });
  });

  it('does not emit when the block is rejected', async () => {
    const { controller, to, emit } = createController(
      vi.fn().mockRejectedValue(new Error('forbidden'))
    );

    await expect(
      controller.blockUser(ME_ID, { username: 'ozamora-' })
    ).rejects.toThrow('forbidden');
    expect(to).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });
});
