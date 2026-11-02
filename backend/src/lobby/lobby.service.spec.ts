
import { describe, expect, it, vi } from 'vitest';

import {
  LobbyService,
  type LobbyMembershipChangedEvent,
} from './lobby.service.js';

function user(id: number) {
  return {
    id,
    username: `player-${id}`,
  };
}

describe('LobbyService membership notifications', () => {
  it('notifies when a lobby is created', () => {
    const service = new LobbyService();

    const listener = vi.fn<
      (event: LobbyMembershipChangedEvent) => void
    >();

    const unsubscribe =
      service.subscribeToMembershipChanges(listener);

    const lobby = service.createLobby(user(1));

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      lobbyId: lobby.id,
      memberIds: [1],
    });

    unsubscribe();
  });

  it('notifies when a member leaves and promotes a new host', () => {
    const service = new LobbyService();

    const host = user(1);
    const member = user(2);

    const lobby = service.createLobby(host);
    const invitation = service.createInvitation(host, member);

    service.acceptInvitation(invitation.id, member);

    const listener = vi.fn<
      (event: LobbyMembershipChangedEvent) => void
    >();

    const unsubscribe =
      service.subscribeToMembershipChanges(listener);

    const result = service.leaveLobby(host.id);

    expect(result).not.toBeNull();
    expect(result?.lobby?.hostUserId).toBe(member.id);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      lobbyId: lobby.id,
      memberIds: [member.id],
    });

    unsubscribe();
  });

  it('notifies both lobbies when a member accepts an invitation', () => {
    const service = new LobbyService();

    const host = user(1);
    const invitedUser = user(2);

    const targetLobby = service.createLobby(host);
    const sourceLobby = service.createLobby(invitedUser);

    const invitation = service.createInvitation(
      host,
      invitedUser
    );

    const listener = vi.fn<
      (event: LobbyMembershipChangedEvent) => void
    >();

    const unsubscribe =
      service.subscribeToMembershipChanges(listener);

    service.acceptInvitation(invitation.id, invitedUser);

    expect(listener).toHaveBeenCalledTimes(2);

    expect(
      listener.mock.calls.map(([event]) => event)
    ).toEqual([
      {
        lobbyId: sourceLobby.id,
        memberIds: [],
      },
      {
        lobbyId: targetLobby.id,
        memberIds: [host.id, invitedUser.id],
      },
    ]);

    unsubscribe();
  });
});
