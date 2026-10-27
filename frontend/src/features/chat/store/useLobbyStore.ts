import { create } from 'zustand';
import { chatSocket } from '@/lib/socket';

export interface LobbyMember {
  userId: number;
  username: string;
  joinedAt: string;
  isHost: boolean;
}

export interface LobbySnapshot {
  id: string;
  hostUserId: number;
  members: LobbyMember[];
  createdAt: string;
}

export interface LobbyInvitation {
  id: string;
  lobbyId: string;
  inviterUserId: number;
  inviterUsername: string;
  createdAt: string;
  expiresAt: string;
}

interface LobbyState {
  lobby: LobbySnapshot | null;
  invitations: LobbyInvitation[];
  error: string | null;
  notice: string | null;

  initListeners: () => () => void;
  createLobby: () => void;
  leaveLobby: () => void;
  inviteFriend: (username: string) => void;
  acceptInvitation: (invitationId: string) => void;
  rejectInvitation: (invitationId: string) => void;
  clearFeedback: () => void;
}

export const useLobbyStore = create<LobbyState>((set) => ({
  lobby: null,
  invitations: [],
  error: null,
  notice: null,

  initListeners: () => {
    const handleConnect = () => {
      chatSocket.emit('lobby:sync');
    };

    const handleState = (data: {
      lobby: LobbySnapshot | null;
      invitations: LobbyInvitation[];
    }) => {
      set({
        lobby: data.lobby,
        invitations: data.invitations,
      });
    };

    const handleCreated = (lobby: LobbySnapshot) => {
      set({
        lobby,
        error: null,
        notice: 'Lobby creado correctamente',
      });
    };

    const handleJoined = (lobby: LobbySnapshot) => {
      set({
        lobby,
        invitations: [],
        error: null,
        notice: 'Te has unido al lobby',
      });
    };

    const handleUpdated = (lobby: LobbySnapshot) => {
      set({ lobby });
    };

    const handleLeft = () => {
      set({
        lobby: null,
        error: null,
        notice: 'Has salido del lobby',
      });
    };

    const handleInvitation = (invitation: LobbyInvitation) => {
      set((state) => ({
        invitations: state.invitations.some((item) => item.id === invitation.id)
          ? state.invitations
          : [...state.invitations, invitation],
        error: null,
      }));
    };

    const handleInvitationSent = (data: { username: string }) => {
      set({
        error: null,
        notice: `Invitación enviada a ${data.username}`,
      });
    };

    const handleInvitationRejected = (data: { invitationId: string }) => {
      set((state) => ({
        invitations: state.invitations.filter(
          (item) => item.id !== data.invitationId
        ),
      }));
    };

    const handleError = (data: { message: string }) => {
      set({ error: data.message, notice: null });
    };

    chatSocket.on('connect', handleConnect);
    chatSocket.on('lobby:state', handleState);
    chatSocket.on('lobby:created', handleCreated);
    chatSocket.on('lobby:joined', handleJoined);
    chatSocket.on('lobby:updated', handleUpdated);
    chatSocket.on('lobby:left', handleLeft);
    chatSocket.on('lobby:invitation', handleInvitation);
    chatSocket.on('lobby:invitationSent', handleInvitationSent);
    chatSocket.on('lobby:invitationRejected', handleInvitationRejected);
    chatSocket.on('lobby:error', handleError);

    // También cubre el caso en que ya estamos conectados.
    if (chatSocket.connected) {
      chatSocket.emit('lobby:sync');
    }

    return () => {
      chatSocket.off('connect', handleConnect);
      chatSocket.off('lobby:state', handleState);
      chatSocket.off('lobby:created', handleCreated);
      chatSocket.off('lobby:joined', handleJoined);
      chatSocket.off('lobby:updated', handleUpdated);
      chatSocket.off('lobby:left', handleLeft);
      chatSocket.off('lobby:invitation', handleInvitation);
      chatSocket.off('lobby:invitationSent', handleInvitationSent);
      chatSocket.off('lobby:invitationRejected', handleInvitationRejected);
      chatSocket.off('lobby:error', handleError);
    };
  },

  createLobby: () => {
    set({ error: null, notice: null });

    if (!chatSocket.connected) {
      set({ error: 'No estás conectado al servidor' });
      return;
    }

    chatSocket.emit('lobby:create');
  },

  leaveLobby: () => {
    set({ error: null, notice: null });

    if (chatSocket.connected) {
      chatSocket.emit('lobby:leave');
    }
  },

  inviteFriend: (username) => {
    const cleanUsername = username.trim();

    if (!cleanUsername) {
      set({ error: 'Introduce un nombre de usuario' });
      return;
    }

    if (!chatSocket.connected) {
      set({ error: 'No estás conectado al servidor' });
      return;
    }

    set({ error: null, notice: null });
    chatSocket.emit('lobby:invite', {
      username: cleanUsername,
    });
  },

  acceptInvitation: (invitationId) => {
    set({ error: null, notice: null });

    if (chatSocket.connected) {
      chatSocket.emit('lobby:accept', { invitationId });
    }
  },

  rejectInvitation: (invitationId) => {
    set({ error: null });

    if (chatSocket.connected) {
      chatSocket.emit('lobby:reject', { invitationId });
    }
  },

  clearFeedback: () => {
    set({ error: null, notice: null });
  },
}));
