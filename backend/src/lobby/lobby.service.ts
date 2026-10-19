
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { randomUUID } from 'node:crypto';

import type { WsUser } from '../auth/ws-jwt-auth.service.js';

interface LobbyMemberRecord {
  userId: number;
  username: string;
  joinedAt: string;
}

interface LobbyRecord {
  id: string;
  hostUserId: number;
  members: Map<number, LobbyMemberRecord>;
  createdAt: string;
}

export interface LobbyMemberView extends LobbyMemberRecord {
  isHost: boolean;
}

export interface LobbySnapshot {
  id: string;
  hostUserId: number;
  members: LobbyMemberView[];
  createdAt: string;
}

export interface LeaveLobbyResult {
  lobbyId: string;
  lobby: LobbySnapshot | null;
}

interface LobbyInvitationRecord {
  id: string;
  lobbyId: string;
  inviterUserId: number;
  inviterUsername: string;
  targetUserId: number;
  createdAt: string;
  expiresAt: string;
}

export interface LobbyInvitationView {
  id: string;
  lobbyId: string;
  inviterUserId: number;
  inviterUsername: string;
  createdAt: string;
  expiresAt: string;
}

@Injectable()
export class LobbyService {
  private readonly lobbies = new Map<string, LobbyRecord>();

  private readonly lobbyIdByUserId = new Map<number, string>();

  private readonly invitations = new Map<string, LobbyInvitationRecord>();

  createLobby(user: WsUser): LobbySnapshot {
	if (this.lobbyIdByUserId.has(user.id)) {
	  throw new WsException('You are already in a lobby');
	}

	const now = new Date().toISOString();

	const lobby: LobbyRecord = {
	  id: randomUUID(),
	  hostUserId: user.id,
	  members: new Map([
		[
		  user.id,
		  {
			userId: user.id,
			username: user.username,
			joinedAt: now,
		  },
		],
	  ]),
	  createdAt: now,
	};

	this.lobbies.set(lobby.id, lobby);
	this.lobbyIdByUserId.set(user.id, lobby.id);

	return this.toSnapshot(lobby);
  }

  getLobbyForUser(userId: number): LobbySnapshot | null {
	const lobbyId = this.lobbyIdByUserId.get(userId);

	if (!lobbyId) {
	  return null;
	}

	const lobby = this.lobbies.get(lobbyId);

	if (!lobby) {
	  this.lobbyIdByUserId.delete(userId);
	  return null;
	}

	return this.toSnapshot(lobby);
  }

  getLobbyById(lobbyId: string): LobbySnapshot | null {
	const lobby = this.lobbies.get(lobbyId);

	return lobby ? this.toSnapshot(lobby) : null;
  }

  leaveLobby(userId: number): LeaveLobbyResult | null {
	const lobbyId = this.lobbyIdByUserId.get(userId);

	if (!lobbyId) {
	  return null;
	}

	const lobby = this.lobbies.get(lobbyId);

	this.lobbyIdByUserId.delete(userId);

	if (!lobby) {
	  return { lobbyId, lobby: null };
	}

	lobby.members.delete(userId);

	if (lobby.members.size === 0) {
	  this.lobbies.delete(lobbyId);

	  return { lobbyId, lobby: null };
	}

	if (lobby.hostUserId === userId) {
	  const nextMember = lobby.members.values().next().value;

	  if (nextMember) {
		lobby.hostUserId = nextMember.userId;
	  }
	}

	return {
	  lobbyId,
	  lobby: this.toSnapshot(lobby),
	};
  }

  private toSnapshot(lobby: LobbyRecord): LobbySnapshot {
	return {
	  id: lobby.id,
	  hostUserId: lobby.hostUserId,
	  createdAt: lobby.createdAt,
	  members: [...lobby.members.values()].map((member) => ({
		...member,
		isHost: member.userId === lobby.hostUserId,
	  })),
	};
  }


	createInvitation(
	inviter: WsUser,
	target: { id: number; username: string },
	): LobbyInvitationView {
	this.cleanupExpiredInvitations();

	const lobbyId = this.lobbyIdByUserId.get(inviter.id);
	const lobby = lobbyId ? this.lobbies.get(lobbyId) : undefined;

	if (!lobby) {
		throw new WsException('You are not in a lobby');
	}

	if (lobby.hostUserId !== inviter.id) {
		throw new WsException('Only the host can invite friends');
	}

	if (target.id === inviter.id) {
		throw new WsException('Cannot invite yourself');
	}

	if (this.lobbyIdByUserId.has(target.id)) {
		throw new WsException('User is already in a lobby');
	}

	if (lobby.members.size >= 4) {
		throw new WsException('Lobby is full');
	}

	const alreadyInvited = [...this.invitations.values()].some(
		(invitation) =>
		invitation.lobbyId === lobby.id &&
		invitation.targetUserId === target.id,
	);

	if (alreadyInvited) {
		throw new WsException('Invitation already exists');
	}

	const now = Date.now();

	const invitation: LobbyInvitationRecord = {
			id: randomUUID(),
			lobbyId: lobby.id,
			inviterUserId: inviter.id,
			inviterUsername: inviter.username,
			targetUserId: target.id,
			createdAt: new Date(now).toISOString(),
			expiresAt: new Date(now + 5 * 60 * 1000).toISOString(),
		};

		this.invitations.set(invitation.id, invitation);

		return this.toInvitationView(invitation);
	}


	getPendingInvitations(userId: number): LobbyInvitationView[] {
		this.cleanupExpiredInvitations();

		return [...this.invitations.values()]
			.filter((invitation) => invitation.targetUserId === userId)
			.map((invitation) => this.toInvitationView(invitation));
	}


	acceptInvitation(
		invitationId: string,
		user: WsUser,
		): LobbySnapshot {
		this.cleanupExpiredInvitations();

		const invitation = this.invitations.get(invitationId);

		if (!invitation || invitation.targetUserId !== user.id) {
			throw new WsException('Invitation not found');
		}

		const lobby = this.lobbies.get(invitation.lobbyId);

		if (!lobby) {
			throw new WsException('Lobby no longer exists');
		}

		if (this.lobbyIdByUserId.has(user.id)) {
			throw new WsException('You are already in a lobby');
		}

		if (lobby.members.size >= 4) {
			throw new WsException('Lobby is full');
		}

		const member: LobbyMemberRecord = {
			userId: user.id,
			username: user.username,
			joinedAt: new Date().toISOString(),
		};

		lobby.members.set(user.id, member);
		this.lobbyIdByUserId.set(user.id, lobby.id);

		// La invitación deja de estar pendiente.
		this.invitations.delete(invitationId);

		// Eliminamos otras invitaciones dirigidas a este usuario.
		for (const [id, pending] of this.invitations) {
			if (pending.targetUserId === user.id) {
			this.invitations.delete(id);
			}
		}

		return this.toSnapshot(lobby);
	}

	
	rejectInvitation(invitationId: string, userId: number): void {
		this.cleanupExpiredInvitations();

		const invitation = this.invitations.get(invitationId);

		if (!invitation || invitation.targetUserId !== userId) {
			throw new WsException('Invitation not found');
		}

		this.invitations.delete(invitationId);
	}

	private cleanupExpiredInvitations(): void {
	const now = Date.now();

		for (const [id, invitation] of this.invitations) {
			if (Date.parse(invitation.expiresAt) <= now) {
			this.invitations.delete(id);
			}
		}
	}

	private toInvitationView(
	invitation: LobbyInvitationRecord,
	): LobbyInvitationView {
		return {
			id: invitation.id,
			lobbyId: invitation.lobbyId,
			inviterUserId: invitation.inviterUserId,
			inviterUsername: invitation.inviterUsername,
			createdAt: invitation.createdAt,
			expiresAt: invitation.expiresAt,
		};
	}


}

