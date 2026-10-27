import { apiFetch } from '../../../api/api';

export interface FriendUser {
  id: number;
  username: string;
  avatarUrl?: string | null;
  status?: 'online' | 'in_game' | 'offline';
  currentGameId?: string | null;
}

export interface FriendRequestItem {
  id: number;
  createdAt: string;
  from?: FriendUser;
  to?: FriendUser;
}

export async function sendFriendRequest(
  username: string
): Promise<{ message: string }> {
  return apiFetch('/users/me/friend-requests', {
    method: 'POST',
    body: JSON.stringify({ username: username.trim() }),
  });
}

export async function fetchFriends(): Promise<FriendUser[]> {
  return apiFetch('/users/me/friends', { method: 'GET' });
}

export async function fetchIncomingRequests(): Promise<FriendRequestItem[]> {
  return apiFetch('/users/me/friend-requests', { method: 'GET' });
}

export async function acceptFriendRequest(
  requestId: number
): Promise<{ message: string }> {
  return apiFetch(`/users/me/friend-requests/${requestId}/accept`, {
    method: 'POST',
  });
}

export async function rejectFriendRequest(
  requestId: number
): Promise<{ message: string }> {
  return apiFetch(`/users/me/friend-requests/${requestId}/reject`, {
    method: 'POST',
  });
}

export async function removeFriend(
  username: string
): Promise<{ message: string }> {
  return apiFetch(`/users/me/friends/${encodeURIComponent(username)}`, {
    method: 'DELETE',
  });
}
