import type { UserPublic } from "./users.js";

export interface AuthCredentials {
  email: string;
  password: string;
  username?: string;
}

export interface AuthResponse {
  user: UserPublic;
}
