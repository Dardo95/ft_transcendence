// Represents the public information of a user that can be shared with others.
export interface UserPublic {
  id: number;
  username: string;
  xp: number;
  isOnline: boolean;
  avatarUrl: string | null;
  createdAt: string;
}

// Represents the private information of a user, including sensitive data.
export interface UserPrivate extends UserPublic {
  email: string;
  twoFaEnabled: boolean;
  oauthProvider: string | null;
  hasPassword: boolean; // false for Google-only accounts
}

// Editable fields of the authenticated user's own profile.
export interface UpdateProfileInput {
  username?: string;
  email?: string;
  currentPassword?: string; // required to change the email
}

// Possible outcomes of a profile update operation.
export type UpdateProfileOutcome =
  "updated" | "username_taken" | "email_taken" | "invalid_username" | "invalid_email";

// Response returned after attempting to update a user's profile.
export interface UpdateProfileResponse {
  outcome: UpdateProfileOutcome;
  user?: UserPrivate;
}
