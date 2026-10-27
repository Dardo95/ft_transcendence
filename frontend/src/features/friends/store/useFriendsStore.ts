import { create } from 'zustand';
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
