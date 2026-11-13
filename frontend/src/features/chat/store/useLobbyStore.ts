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
  lobbyInvitations: LobbyInvitation[];
  error: string | null;
  notice: string | null;
  noticeData: string | null;

  initListeners: () => () => void;
  createLobby: () => void;
  leaveLobby: () => void;
  inviteFriendToLobby: (username: string) => void;
  acceptLobbyInvitation: (invitationId: string) => void;
  rejectLobbyInvitation: (invitationId: string) => void;
  clearError: () => void;
  clearNotice: () => void;
  clearFeedback: () => void;
}

export const useLobbyStore = create<LobbyState>((set) => ({
  lobby: null,
  lobbyInvitations: [],
  error: null,
  notice: null,
  noticeData: null,

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
        lobbyInvitations: data.invitations,
      });
    };

    const handleCreated = (lobby: LobbySnapshot) => {
      set({
        lobby,
        error: null,
        notice: 'noticeLobbyCreated',
        noticeData: null,
      });
    };

    const handleJoined = (lobby: LobbySnapshot) => {
      set({
        lobby,
        lobbyInvitations: [],
        error: null,
        notice: 'noticeJoinedLobby',
        noticeData: null,
      });
    };

    const handleUpdated = (lobby: LobbySnapshot) => {
      set({ lobby });
    };

    const handleLeft = () => {
      set({
        lobby: null,
        error: null,
        notice: 'noticeLeftLobby',
        noticeData: null,
      });
    };

    const handleInvitation = (invitation: LobbyInvitation) => {
      set((state) => ({
        lobbyInvitations: state.lobbyInvitations.some(
          (item) => item.id === invitation.id
        )
          ? state.lobbyInvitations
          : [...state.lobbyInvitations, invitation],
        error: null,
      }));
    };

    const handleInvitationSent = (data: { username: string }) => {
      set({
        error: null,
        notice: 'noticeInvitationSent',
        noticeData: data.username,
      });
    };

    const handleInvitationRejected = (data: { invitationId: string }) => {
      set((state) => ({
        lobbyInvitations: state.lobbyInvitations.filter(
          (item) => item.id !== data.invitationId
        ),
        notice: null,
        noticeData: null,
      }));
    };

    const handleError = (data: { message: string }) => {
      set({ error: data.message, notice: null, noticeData: null });
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
    set({ error: null, notice: null, noticeData: null });

    if (!chatSocket.connected) {
      set({ error: 'errorNotConnected' });
      return;
    }

    chatSocket.emit('lobby:create');
  },

  leaveLobby: () => {
    set({ error: null, notice: null, noticeData: null });

    if (chatSocket.connected) {
      chatSocket.emit('lobby:leave');
    }
  },

  inviteFriendToLobby: (username: string) => {
    const cleanUsername = username.trim();

    if (!cleanUsername) {
      set({ error: 'errorEnterUsername' });
      return;
    }

    if (!chatSocket.connected) {
      set({ error: 'errorNotConnected' });
      return;
    }

    set({ error: null, notice: null, noticeData: null });
    chatSocket.emit('lobby:invite', {
      username: cleanUsername,
    });
  },

  acceptLobbyInvitation: (invitationId: string) => {
    set({ error: null, notice: null, noticeData: null });

    if (chatSocket.connected) {
      chatSocket.emit('lobby:accept', { invitationId });
    }
  },

  rejectLobbyInvitation: (invitationId: string) => {
    set({ error: null, notice: null, noticeData: null });

    if (chatSocket.connected) {
      chatSocket.emit('lobby:reject', { invitationId });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearNotice: () => {
    set({ notice: null, noticeData: null });
  },

  clearFeedback: () => {
    set({ error: null, notice: null, noticeData: null });
  },
}));
