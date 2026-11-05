// API contract shared by the frontend and backend consumers.
export interface UserPublic {
  id: number;
  username: string;
  xp: number;
  isOnline: boolean;
  avatarUrl: string | null;
  createdAt: string;
}

export interface UserPrivate extends UserPublic {
  email: string;
  twoFaEnabled: boolean;
  oauthProvider: string | null;
}
