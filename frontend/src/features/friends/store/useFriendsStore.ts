import { create } from 'zustand';
import { chatSocket } from '@/lib/socket';
import {
  type FriendUser,
  type FriendRequestItem,
  fetchFriends,
  fetchIncomingRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} from '../service/friendsService';

interface FriendsState {
  friends: FriendUser[];
  incomingFriendRequests: FriendRequestItem[];
  isLoading: boolean;
  error: string | null;

  initListeners: () => () => void;
  loadFriendsData: () => Promise<void>;
  sendFriendRequest: (username: string) => Promise<void>;
  acceptFriendRequest: (requestId: number) => Promise<void>;
  rejectFriendRequest: (requestId: number) => Promise<void>;
  deleteFriend: (username: string) => Promise<void>;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [],
  incomingFriendRequests: [],
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
      const [friendsList, requests] = await Promise.all([
        fetchFriends().catch(() => []),
        fetchIncomingRequests().catch(() => []),
      ]);
      set({
        friends: friendsList,
        incomingFriendRequests: requests,
        isLoading: false,
      });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar amigos',
        isLoading: false,
      });
    }
  },

  sendFriendRequest: async (username: string) => {
    set({ error: null });
    await sendFriendRequest(username);
    await get().loadFriendsData();
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
}));
