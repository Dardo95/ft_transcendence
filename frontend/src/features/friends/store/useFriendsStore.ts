import { create } from 'zustand';
import type { UserPublic } from '@transcendence/shared';
import { chatSocket } from '@/lib/socket';
import {
  type FriendUser,
  type FriendRequestItem,
  type SendFriendRequestResult,
  fetchFriends,
  fetchIncomingRequests,
  getBlockedUsers,
  blockUser as blockUserRequest,
  unblockUser as unblockUserRequest,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} from '../service/friendsService';

interface FriendsState {
  friends: FriendUser[];
  incomingFriendRequests: FriendRequestItem[];
  blockedUsers: UserPublic[];
  isLoading: boolean;
  error: string | null;

  initListeners: () => () => void;
  loadFriendsData: () => Promise<void>;
  fetchBlockedUsers: () => Promise<void>;
  sendFriendRequest: (username: string) => Promise<SendFriendRequestResult>;
  acceptFriendRequest: (requestId: number) => Promise<void>;
  rejectFriendRequest: (requestId: number) => Promise<void>;
  deleteFriend: (username: string) => Promise<void>;
  blockUser: (username: string) => Promise<void>;
  unblockUser: (username: string) => Promise<void>;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [],
  incomingFriendRequests: [],
  blockedUsers: [],
  isLoading: false,
  error: null,

  initListeners: () => {
    const reload = () => get().loadFriendsData();
    chatSocket.on('friend:incoming_request', reload);
    chatSocket.on('friend:accepted', reload);
    chatSocket.on('friend:rejected', reload);
    chatSocket.on('friend:removed', reload);
    chatSocket.on('friend:status', reload);
    return () => {
      chatSocket.off('friend:incoming_request', reload);
      chatSocket.off('friend:accepted', reload);
      chatSocket.off('friend:rejected', reload);
      chatSocket.off('friend:removed', reload);
      chatSocket.off('friend:status', reload);
    };
  },

  loadFriendsData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [friendsList, requests, blocked] = await Promise.all([
        fetchFriends().catch(() => []),
        fetchIncomingRequests().catch(() => []),
        getBlockedUsers().catch(() => []),
      ]);
      set({
        friends: friendsList,
        incomingFriendRequests: requests,
        blockedUsers: blocked.map((entry) => entry.user),
        isLoading: false,
      });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Could not load friends',
        isLoading: false,
      });
    }
  },

  fetchBlockedUsers: async () => {
    try {
      const blocked = await getBlockedUsers();
      set({ blockedUsers: blocked.map((entry) => entry.user) });
    } catch {
      // Keep the current list when the endpoint is temporarily unavailable.
    }
  },

  sendFriendRequest: async (username: string) => {
    set({ error: null });
    const result = await sendFriendRequest(username);
    if (result.outcome === 'created' || result.outcome === 'already_exists') {
      await get().loadFriendsData();
    }
    return result;
  },

  acceptFriendRequest: async (requestId: number) => {
    await acceptFriendRequest(requestId);
    await get().loadFriendsData();
  },

  rejectFriendRequest: async (requestId: number) => {
    await rejectFriendRequest(requestId);
    await get().loadFriendsData();
  },

  deleteFriend: async (username: string) => {
    await removeFriend(username);
    set((state) => ({
      friends: state.friends.filter((f) => f.username !== username),
    }));
  },

  blockUser: async (username: string) => {
    set({ error: null });
    await blockUserRequest(username);
    const knownUser = get().friends.find((f) => f.username === username);
    set((state) => ({
      friends: state.friends.filter((f) => f.username !== username),
      incomingFriendRequests: state.incomingFriendRequests.filter(
        (request) => request.from?.username !== username
      ),
      blockedUsers:
        knownUser && !state.blockedUsers.some((u) => u.username === username)
          ? [...state.blockedUsers, knownUser]
          : state.blockedUsers,
    }));
    await get().fetchBlockedUsers();
  },

  unblockUser: async (username: string) => {
    set({ error: null });
    await unblockUserRequest(username);
    set((state) => ({
      blockedUsers: state.blockedUsers.filter((u) => u.username !== username),
    }));
  },
}));
